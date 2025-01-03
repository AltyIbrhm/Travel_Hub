const transformProfileResponse = (profile) => {
  if (!profile) return null;
  
  // Helper function to format date to DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return '';
    
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return '';
    }
  };
  
  return {
    status: 'success',
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
      dateOfBirth: formatDate(profile.DateOfBirth),
      address: profile.Address || '',
      profilePicture: profile.ProfilePicture || null,
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