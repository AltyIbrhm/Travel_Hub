-- Profile Table
CREATE TABLE Profiles (
    ProfileID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(20) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Language NVARCHAR(20) NOT NULL,
    Address NVARCHAR(255),
    ProfilePicture NVARCHAR(255),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Profiles_Users FOREIGN KEY (UserID) REFERENCES Users(id),
    CONSTRAINT CK_Profiles_Language CHECK (Language IN ('English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'))
);
GO

-- Emergency Contacts Table
CREATE TABLE EmergencyContacts (
    EmergencyContactID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    EmergencyName NVARCHAR(100) NOT NULL,
    EmergencyPhone NVARCHAR(20) NOT NULL,
    EmergencyRelationship NVARCHAR(20) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_EmergencyContacts_Users FOREIGN KEY (UserID) REFERENCES Users(id),
    CONSTRAINT CK_EmergencyContacts_Relationship CHECK (EmergencyRelationship IN ('Parent', 'Spouse', 'Sibling', 'Friend', 'Other'))
);
GO

-- Trigger for UpdatedAt timestamp on Profiles
CREATE TRIGGER TR_Profiles_UpdatedAt
ON Profiles
AFTER UPDATE
AS
BEGIN
    UPDATE Profiles
    SET UpdatedAt = GETDATE()
    FROM Profiles p
    INNER JOIN inserted i ON p.ProfileID = i.ProfileID;
END;
GO

-- Trigger for UpdatedAt timestamp on EmergencyContacts
CREATE TRIGGER TR_EmergencyContacts_UpdatedAt
ON EmergencyContacts
AFTER UPDATE
AS
BEGIN
    UPDATE EmergencyContacts
    SET UpdatedAt = GETDATE()
    FROM EmergencyContacts ec
    INNER JOIN inserted i ON ec.EmergencyContactID = i.EmergencyContactID;
END;
GO 