/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         ProfileID:
 *           type: integer
 *           description: The profile ID
 *         UserID:
 *           type: integer
 *           description: The user ID
 *         FirstName:
 *           type: string
 *           description: User's first name
 *         LastName:
 *           type: string
 *           description: User's last name
 *         Email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         PhoneNumber:
 *           type: string
 *           description: User's phone number
 *         DateOfBirth:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *         Language:
 *           type: string
 *           enum: [English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean]
 *           description: User's preferred language
 *         Address:
 *           type: string
 *           description: User's address
 *         ProfilePicture:
 *           type: string
 *           description: URL to user's profile picture
 *         CreatedAt:
 *           type: string
 *           format: date-time
 *         UpdatedAt:
 *           type: string
 *           format: date-time
 *     
 *     EmergencyContact:
 *       type: object
 *       properties:
 *         EmergencyContactID:
 *           type: integer
 *           description: The emergency contact ID
 *         UserID:
 *           type: integer
 *           description: The user ID
 *         EmergencyName:
 *           type: string
 *           description: Emergency contact's name
 *         EmergencyPhone:
 *           type: string
 *           description: Emergency contact's phone number
 *         EmergencyRelationship:
 *           type: string
 *           enum: [Parent, Spouse, Sibling, Friend, Other]
 *           description: Relationship with emergency contact
 *         CreatedAt:
 *           type: string
 *           format: date-time
 *         UpdatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile and emergency contact
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *                 emergencyContact:
 *                   $ref: '#/components/schemas/EmergencyContact'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 * 
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               language:
 *                 type: string
 *                 enum: [English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean]
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 * 
 *   delete:
 *     summary: Delete user profile and emergency contact
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/profile/emergency-contact:
 *   put:
 *     summary: Update emergency contact
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emergencyName
 *               - emergencyPhone
 *               - emergencyRelationship
 *             properties:
 *               emergencyName:
 *                 type: string
 *               emergencyPhone:
 *                 type: string
 *               emergencyRelationship:
 *                 type: string
 *                 enum: [Parent, Spouse, Sibling, Friend, Other]
 *     responses:
 *       200:
 *         description: Emergency contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmergencyContact'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/profile/photo:
 *   post:
 *     summary: Upload profile photo
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo (JPEG, PNG, or GIF, max 5MB)
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 * 
 *   delete:
 *     summary: Delete profile photo
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Photo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No profile photo found
 *       500:
 *         description: Server error
 */

module.exports = {
  paths: {}, // Will be merged with main Swagger config
  schemas: {
    Profile: {},
    EmergencyContact: {}
  }
}; 