-- Check if we're in the right database
SELECT DB_NAME() AS CurrentDatabase;

-- Check if the table exists
SELECT OBJECT_ID('dbo.Reservations') AS TableObjectId;

-- Get detailed column information
SELECT 
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.precision AS Precision,
    c.scale AS Scale,
    c.is_nullable AS IsNullable,
    OBJECT_SCHEMA_NAME(c.object_id) AS SchemaName,
    OBJECT_NAME(c.object_id) AS TableName
FROM sys.columns c
JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE OBJECT_NAME(c.object_id) = 'Reservations'
ORDER BY c.column_id;

-- Check for any typos in column names
SELECT name 
FROM sys.columns 
WHERE object_id = OBJECT_ID('dbo.Reservations')
AND name LIKE '%fee%'; 