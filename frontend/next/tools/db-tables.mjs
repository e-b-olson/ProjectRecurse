console.log(await db.execute(`
  select tablename
  from pg_tables
  where schemaname = 'public'
`));