-- Create user_preferences table
CREATE TABLE user_preferences (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    email_notifications BIT DEFAULT 1,
    sms_notifications BIT DEFAULT 0,
    marketing_notifications BIT DEFAULT 1,
    app_updates BIT DEFAULT 1,
    security_alerts BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_UserPreferences_Users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on user_id for faster lookups
CREATE INDEX IX_UserPreferences_UserId ON user_preferences(user_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER TR_UserPreferences_UpdateTimestamp
ON user_preferences
AFTER UPDATE
AS
BEGIN
    UPDATE user_preferences
    SET updated_at = GETDATE()
    FROM user_preferences u
    INNER JOIN inserted i ON u.id = i.id;
END; 