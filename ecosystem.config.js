module.exports = {
  apps : [
    {
      name      : 'vue-myfifa',
      exec_mode : 'cluster',
      instances : 'max',
      script    : './node_modules/nuxt/bin/nuxt-start',
      env: {
        HOST: '0.0.0.0',
        PORT: '8080',
        NODE_ENV: 'production'
      }
    }
  ],
};
