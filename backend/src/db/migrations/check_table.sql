-- Check if the table exists and get its schema
SELECT 
    s.name AS SchemaName,
    t.name AS TableName
FROM sys.tables t
INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
WHERE t.name = 'Reservations';

-- Check the exact column names and their case
SELECT 
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable AS IsNullable,
    OBJECT_SCHEMA_NAME(c.object_id) AS SchemaName
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE OBJECT_NAME(c.object_id) = 'Reservations'
ORDER BY c.column_id;

-- Check for any typos in column names
SELECT name 
FROM sys.columns 
WHERE object_id = OBJECT_ID('Reservations')
AND name LIKE '%fee%'; 