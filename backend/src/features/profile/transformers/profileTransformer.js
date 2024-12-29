const transformProfileResponse = (profile) => {
  if (!profile) return null;
  
  return {
    profile: {
      id: profile.ProfileID,
      userId: profile.UserID,
      name: {
        first: profile.FirstName || '',
        last: profile.LastName || '',
        full: `${profile.FirstName || ''} ${profile.LastName || ''}`.trim()
      },
      contact: {
        email: profile.Email || '',
        phone: profile.PhoneNumber || ''
      },
      preferences: {
        language: profile.Language || 'English'
      },
      dateOfBirth: profile.DateOfBirth ? new Date(profile.DateOfBirth).toISOString().split('T')[0] : '',
      address: profile.Address || '',
      avatar: profile.ProfilePicture || null,
      timestamps: {
        created: profile.CreatedAt,
        updated: profile.UpdatedAt
      }
    }
  };
};

const transformEmergencyContactResponse = (contact) => {
  if (!contact) return null;

  return {
    emergencyContact: {
      id: contact.EmergencyContactID,
      userId: contact.UserID,
      contact: {
        name: contact.EmergencyName || '',
        phone: contact.EmergencyPhone || '',
        relationship: contact.EmergencyRelationship || ''
      },
      timestamps: {
        created: contact.CreatedAt,
        updated: contact.UpdatedAt
      }
    }
  };
};

const transformProfileWithEmergencyContact = (profile, emergencyContact) => {
  const transformedProfile = transformProfileResponse(profile);
  const transformedContact = transformEmergencyContactResponse(emergencyContact);

  return {
    profile: transformedProfile?.profile || null,
    emergencyContact: transformedContact?.emergencyContact || null
  };
};

module.exports = {
  transformProfileResponse,
  transformEmergencyContactResponse,
  transformProfileWithEmergencyContact
}; 