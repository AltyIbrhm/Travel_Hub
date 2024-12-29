-- Create Profiles table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Profiles]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Profiles] (
        [ProfileID] INT IDENTITY(1,1) PRIMARY KEY,
        [UserID] INT NOT NULL,
        [FirstName] NVARCHAR(50),
        [LastName] NVARCHAR(50),
        [Email] NVARCHAR(100),
        [PhoneNumber] NVARCHAR(20),
        [DateOfBirth] DATE,
        [Language] NVARCHAR(20),
        [Address] NVARCHAR(255),
        [ProfilePicture] NVARCHAR(255),
        [CreatedAt] DATETIME DEFAULT GETDATE(),
        [UpdatedAt] DATETIME DEFAULT GETDATE()
    );
END

-- Create EmergencyContacts table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EmergencyContacts]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[EmergencyContacts] (
        [EmergencyContactID] INT IDENTITY(1,1) PRIMARY KEY,
        [UserID] INT NOT NULL,
        [emergencyName] NVARCHAR(100),
        [emergencyPhone] NVARCHAR(20),
        [emergencyRelationship] NVARCHAR(20),
        [CreatedAt] DATETIME DEFAULT GETDATE(),
        [UpdatedAt] DATETIME DEFAULT GETDATE()
    );
END

-- Add foreign key constraints
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Profiles_Users]') AND parent_object_id = OBJECT_ID(N'[dbo].[Profiles]'))
BEGIN
    ALTER TABLE [dbo].[Profiles]
    ADD CONSTRAINT [FK_Profiles_Users] FOREIGN KEY ([UserID])
    REFERENCES [dbo].[Users] ([UserID])
    ON DELETE CASCADE;
END

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_EmergencyContacts_Users]') AND parent_object_id = OBJECT_ID(N'[dbo].[EmergencyContacts]'))
BEGIN
    ALTER TABLE [dbo].[EmergencyContacts]
    ADD CONSTRAINT [FK_EmergencyContacts_Users] FOREIGN KEY ([UserID])
    REFERENCES [dbo].[Users] ([UserID])
    ON DELETE CASCADE;
END 