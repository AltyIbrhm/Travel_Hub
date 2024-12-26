-- Check Users table structure
SELECT 
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable AS IsNullable
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE OBJECT_NAME(c.object_id) = 'Users'
AND c.name = 'id';

-- Also check if the table exists and its schema
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users';

-- Check constraints on Users table
SELECT 
    OBJECT_NAME(object_id) AS ConstraintName,
    type_desc AS ConstraintType,
    OBJECT_NAME(parent_object_id) AS TableName
FROM sys.objects
WHERE parent_object_id = OBJECT_ID('Users'); 

-- Check Users table id column type
SELECT 
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable AS IsNullable,
    t.max_length AS TypeMaxLength
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE OBJECT_NAME(c.object_id) = 'Users'
AND c.name = 'id';

-- Also show the full create script for Users table
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Users'
ORDER BY ORDINAL_POSITION; 