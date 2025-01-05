module.exports = {
  apps : [{
    name   : "green-frontend",
    script : "npm start",
    env: {
      NODE_ENV: "production",
      HOST: "127.0.0.1",
      PORT: '3001'
    },
  }],

  
  deploy: {
    production: {
      user  : "ubuntu",
      key   : "/Users/eissa/Rika/AWS/openvpnserverkey.pem",
      host  : "ec2-18-156-159-74.eu-central-1.compute.amazonaws.com", //RikaBE-P server system
      ref   : "origin/main",
      repo  : "git@github.com:moekur/green-frontend.git",
      path  : "/home/ubuntu/greenchains/green-frontend",
      "pre-deploy-local": "",
      "post-deploy" : "source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup"   : "",
      "ssh_options" : "ForwardAgent=yes"
    }
  }
}