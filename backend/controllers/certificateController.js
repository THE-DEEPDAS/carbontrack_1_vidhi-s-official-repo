// backend/controllers/certificateController.js
import Certificate from '../models/Certificate.js';
import UserCertificate from '../models/userCertificate.js';
import cloudinary from 'cloudinary';
import { createCanvas, loadImage } from 'canvas';

// Configure Cloudinary (assumed setup)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fetch all certificates and the user's progress
export const getCertificates = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log(`getCertificates - userId: ${userId}`);
  
      // Fetch all global certificates
      const certificates = await Certificate.find().exec();
      console.log(`getCertificates - Found ${certificates.length} global certificates`);
  
      // Fetch or initialize the user's progress for each certificate
      const userCertificates = await Promise.all(
        certificates.map(async (cert) => {
          let userCert = await UserCertificate.findOne({
            userId,
            certificateId: cert._id,
          }).exec();
  
          if (!userCert) {
            console.log(`getCertificates - Initializing UserCertificate for certificateId: ${cert._id}, userId: ${userId}`);
            userCert = new UserCertificate({
              userId,
              certificateId: cert._id,
              goals: cert.goals.map((goal) => ({
                goalId: goal._id,
                completed: false,
                proof: null,
                verified: false,
              })),
              progress: 0,
              eligible: false,
              verified: false,
            });
            await userCert.save();
            console.log(`getCertificates - Created UserCertificate with _id: ${userCert._id}`);
          }
  
          return {
            ...cert.toObject(),
            _id: userCert._id.toString(), // Use the UserCertificate _id
            certificateId: cert._id.toString(), // Include the global Certificate _id
            userProgress: userCert.progress,
            userGoals: userCert.goals,
            eligible: userCert.eligible,
            verified: userCert.verified,
          };
        })
      );
  
      console.log('getCertificates - Returning userCertificates:', userCertificates.map(uc => ({ _id: uc._id, certificateId: uc.certificateId, name: uc.name })));
      res.status(200).json({ success: true, certificates: userCertificates });
    } catch (error) {
      console.error('getCertificates - Error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
// Fetch all user certificates for admin view
// backend/controllers/certificateController.js
export const getAllCertificates = async (req, res) => {
    try {
      console.log("getAllCertificates - req.user:", req.user); // Debug
      const userRole = req.user && req.user.role ? req.user.role.toLowerCase() : null;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      // Fetch all user certificates and populate user and certificate details
      const userCertificates = await UserCertificate.find()
        .populate('userId', 'email')
        .populate('certificateId', 'name description goals requirements')
        .exec();
      console.log("getAllCertificates - Fetched userCertificates:", userCertificates); // Debug
  
      // Filter out userCertificates where certificateId is null
      const validUserCertificates = userCertificates.filter(uc => uc.certificateId !== null);
      console.log("getAllCertificates - Valid userCertificates:", validUserCertificates); // Debug
  
      res.status(200).json({ success: true, userCertificates: validUserCertificates });
    } catch (error) {
      console.error("getAllCertificates - Error:", error); // Debug
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Upload proof for a goal
export const uploadProof = async (req, res) => {
    try {
      const { certId, goalId } = req.params;
      const user = req.user;
  
      console.log(`uploadProof - certId: ${certId}, goalId: ${goalId}, user: ${user.id}, role: ${user.role}`);
  
      // Fetch the UserCertificate by _id
      const userCertificate = await UserCertificate.findById(certId).exec();
  
      if (!userCertificate) {
        console.log(`uploadProof - Certificate not found: ${certId}`);
        return res.status(404).json({ message: 'Certificate not found' });
      }
  
      // Check authorization: Allow the owner or an admin
      if (userCertificate.userId.toString() !== user.id && user.role !== 'admin') {
        console.log(`uploadProof - Unauthorized: user ${user.id} for certificate ${certId}`);
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      // Find the goal in the user's certificate
      const userGoal = userCertificate.goals.find((g) => g.goalId.toString() === goalId);
      if (!userGoal) {
        console.log(`uploadProof - Goal not found: ${goalId} in certificate ${certId}`);
        return res.status(404).json({ message: 'Goal not found' });
      }
  
      // Check if proof is already uploaded
      if (userGoal.proof) {
        console.log(`uploadProof - Proof already uploaded for goal: ${goalId}`);
        return res.status(400).json({ message: 'Proof already uploaded' });
      }
  
      // Upload the proof to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) reject(new Error('Cloudinary upload failed'));
            resolve(result);
          }
        ).end(req.file.buffer);
      });
  
      // Update the goal with the proof URL
      userGoal.proof = result.secure_url;
      userGoal.completed = true;
  
      // Recalculate progress
      const completedGoals = userCertificate.goals.filter((g) => g.completed).length;
      userCertificate.progress = (completedGoals / userCertificate.goals.length) * 100;
      userCertificate.eligible = userCertificate.progress === 100;
  
      // Check if all goals are verified
      const verifiedGoals = userCertificate.goals.filter((g) => g.verified).length;
      userCertificate.verified = verifiedGoals === userCertificate.goals.length;
  
      await userCertificate.save();
  
      console.log(`uploadProof - Proof uploaded for goal: ${goalId}, certificate: ${certId}`);
      res.status(200).json({ success: true, userCertificate });
    } catch (error) {
      console.error('uploadProof - Error:', error);
      res.status(500).json({ message: 'Upload failed', error: error.message });
    }
  };

// Verify a goal (admin only)
export const verifyGoal = async (req, res) => {
    try {
      const { certId, goalId } = req.params;
  
      const userRole = req.user && req.user.role ? req.user.role.toLowerCase() : null;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      const userCertificate = await UserCertificate.findById(certId).exec();
      if (!userCertificate) {
        return res.status(404).json({ message: 'Certificate not found' });
      }
  
      const userGoal = userCertificate.goals.find((g) => g.goalId.toString() === goalId);
      if (!userGoal) {
        return res.status(404).json({ message: 'Goal not found' });
      }
  
      userGoal.verified = true;
  
      const verifiedGoals = userCertificate.goals.filter((g) => g.verified).length;
      userCertificate.verified = verifiedGoals === userCertificate.goals.length;
  
      await userCertificate.save();
  
      // Populate userId and certificateId before returning
      const populatedUserCertificate = await UserCertificate.findById(certId)
        .populate('userId', 'email')
        .populate('certificateId', 'name description goals requirements')
        .exec();
  
      res.status(200).json({ success: true, userCertificate: populatedUserCertificate });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
// Download certificate (placeholder, assuming a generated file)





export const downloadCertificate = async (req, res) => {
  try {
    const { certId } = req.params;
    const user = req.user;

    console.log(`downloadCertificate - certId: ${certId}, user: ${user.id}, role: ${user.role}`);

    // Fetch the UserCertificate
    const userCertificate = await UserCertificate.findById(certId)
      .populate('userId', 'email fullName')
      .populate('certificateId', 'name description')
      .exec();

    if (!userCertificate) {
      console.log(`downloadCertificate - Certificate not found: ${certId}`);
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Check authorization
    if (userCertificate.userId._id.toString() !== user.id && user.role !== 'admin') {
      console.log(`downloadCertificate - Unauthorized: user ${user.id} for certificate ${certId}`);
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if the certificate is verified
    if (!userCertificate.verified) {
      console.log(`downloadCertificate - Certificate not verified: ${certId}`);
      return res.status(400).json({ message: 'Certificate not verified' });
    }

    console.log('downloadCertificate - Generating certificate...');

    // Create a canvas (A4 size in landscape: 1123x794 pixels at 96 DPI)
    const canvas = createCanvas(1123, 794);
    const ctx = canvas.getContext('2d');

    // Background: White
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1123, 794);

    // Draw the geometric border
    ctx.strokeStyle = '#2e7d32'; // Dark green
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 1083, 754);

    // Inner geometric border with triangular corners
    ctx.strokeStyle = '#4caf50'; // Light green
    ctx.lineWidth = 5;
    ctx.beginPath();
    // Top-left corner
    ctx.moveTo(40, 40);
    ctx.lineTo(80, 40);
    ctx.lineTo(40, 80);
    ctx.lineTo(40, 40);
    ctx.stroke();
    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(1083, 40);
    ctx.lineTo(1043, 40);
    ctx.lineTo(1083, 80);
    ctx.lineTo(1083, 40);
    ctx.stroke();
    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(40, 754);
    ctx.lineTo(80, 754);
    ctx.lineTo(40, 714);
    ctx.lineTo(40, 754);
    ctx.stroke();
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(1083, 754);
    ctx.lineTo(1043, 754);
    ctx.lineTo(1083, 714);
    ctx.lineTo(1083, 754);
    ctx.stroke();
    // Connect the corners
    ctx.beginPath();
    ctx.moveTo(80, 40);
    ctx.lineTo(1043, 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1083, 80);
    ctx.lineTo(1083, 714);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1043, 754);
    ctx.lineTo(80, 754);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(40, 714);
    ctx.lineTo(40, 80);
    ctx.stroke();

    // Title: "Certificate of Achievement"
    ctx.fillStyle = '#2e7d32';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Achievement', 562, 120);

    // Subtitle: "This certificate is proudly presented to"
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(411, 160, 300, 40); // Green box
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('This certificate is proudly presented to', 561, 180);

    // Recipient Name
    ctx.font = 'italic 60px "Times New Roman"';
    ctx.fillStyle = '#2e7d32';
    const recipientName = userCertificate.userId.fullName || userCertificate.userId.email;
    ctx.fillText(recipientName, 562, 280);

    // Decorative lines around the description
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(262, 340);
    ctx.lineTo(862, 340);
    ctx.stroke();
    // Small arrows on the lines
    ctx.beginPath();
    ctx.moveTo(262, 340);
    ctx.lineTo(272, 330);
    ctx.lineTo(272, 350);
    ctx.lineTo(262, 340);
    ctx.fillStyle = '#4caf50';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(862, 340);
    ctx.lineTo(852, 330);
    ctx.lineTo(852, 350);
    ctx.lineTo(862, 340);
    ctx.fill();

    // Certificate Name and Description
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Achievement: ${userCertificate.certificateId.name}`, 562, 400);

    ctx.font = '16px Arial';
    const description = `For your exceptional dedication to environmental sustainability. Your efforts in completing this program have contributed significantly to a greener future.`;
    // Wrap text manually
    const maxWidth = 800;
    const lineHeight = 25;
    let words = description.split(' ');
    let line = '';
    let y = 450;
    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, 562, y);
        line = words[i] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 562, y);

    // Date
    ctx.font = '16px Arial';
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 262, 600);

    // Stamp (simulated with a circle and text)
    ctx.fillStyle = '#ffca28'; // Gold color for stamp
    ctx.beginPath();
    ctx.arc(862, 600, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#2e7d32';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CERTIFIED', 862, 600);
    ctx.font = '10px Arial';
    ctx.fillText('Environmental Award', 862, 620);

    // Convert canvas to PNG buffer
    const buffer = canvas.toBuffer('image/png');
    console.log('downloadCertificate - PNG buffer generated, length:', buffer.length);

    // Send the PNG file
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', 'attachment; filename="certificate.png"');
    res.send(buffer);

    console.log(`downloadCertificate - Certificate sent for certId: ${certId}`);
  } catch (error) {
    console.error('downloadCertificate - Error:', error);
    res.status(500).json({ message: 'Error generating certificate', error: error.message });
  }
};