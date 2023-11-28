module.exports = {
  reactStrictMode: true,
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login', // Rota para a sua página desejada
        permanent: true,
      },
    ];
  },
};
