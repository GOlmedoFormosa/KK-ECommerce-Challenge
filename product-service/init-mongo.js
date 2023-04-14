db.createUser({
  user: 'kuantokusta',
  pwd: 'kuantokusta',
  roles: [
    {
      role: 'readWrite',
      db: 'kk_products',
    },
  ],
});
