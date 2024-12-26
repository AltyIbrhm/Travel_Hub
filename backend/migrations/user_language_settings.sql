-- Create user_language_settings table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[user_language_settings]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[user_language_settings] (
        [id] INT IDENTITY(1,1) PRIMARY KEY,
        [user_id] INT NOT NULL,
        [language] NVARCHAR(10) NOT NULL DEFAULT 'en',
        [timezone] NVARCHAR(50) NOT NULL DEFAULT 'UTC',
        [created_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [updated_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [FK_UserLanguageSettings_Users] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id])
    );

    -- Create index on user_id for faster lookups
    CREATE UNIQUE INDEX [IX_UserLanguageSettings_UserId] ON [dbo].[user_language_settings]([user_id]);

    -- Create trigger to update updated_at timestamp
    CREATE TRIGGER [dbo].[TR_UserLanguageSettings_UpdateTimestamp]
    ON [dbo].[user_language_settings]
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE [dbo].[user_language_settings]
        SET [updated_at] = GETUTCDATE()
        FROM Inserted i
        WHERE [user_language_settings].[id] = i.[id];
    END;
END;

-- Insert default settings for existing users
INSERT INTO [dbo].[user_language_settings] ([user_id], [language], [timezone])
SELECT [id], 'en', 'UTC'
FROM [users] u
WHERE NOT EXISTS (
    SELECT 1 FROM [user_language_settings] uls WHERE uls.[user_id] = u.[id]
); 