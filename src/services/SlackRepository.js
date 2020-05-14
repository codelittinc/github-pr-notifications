const repositoriesIdentifiers = {
  'roadrunner': {
    devGroup: '@engineers',
    channel: 'team-automations-dev',
    owner: 'codelittinc',
    supports_deploy: false
  },
  'gh-hooks-repo-test': {
    devGroup: '@elbigode',
    channel: 'test-gh',
    deployChannel: 'test-gh-deploy',
    owner: 'codelittinc',
    supports_deploy: true,
    deploy_with_tag: false
  },
  'codelitt-v2': {
    devGroup: '@website-devs',
    channel: 'team-website-dev',
    deployChannel: 'team-website-deploy',
    owner: 'codelittinc',
    supports_deploy: true,
    servers: ['dev-website-codelitt', 'qa-codelitt-website', 'prod-codelitt-website'],
    deploy_with_tag: true
  },
  'rolli': {
    devGroup: '@rolli-devs',
    channel: 'team-rolli-dev',
    deployChannel: 'team-rolli-deploy',
    owner: 'codelittinc',
    supports_deploy: true,
    servers: ['dev-rolli', 'qa-rolli', 'prod-rolli'],
    deploy_with_tag: true
  },
  'team-maker': {
    devGroup: '@team-maker-devs',
    channel: 'team-teammaker-dev',
    deployChannel: 'wg-teammaker-deploy',
    owner: 'codelittinc',
    supports_deploy: true,
    servers: ['dev-team-maker', 'qa-team-maker', 'prod-team-maker']
  },
  'zonda': {
    devGroup: '@zonda-devs',
    channel: 'team-zonda-dev',
    deployChannel: 'wg-zonda-deploy',
    owner: 'codelittinc',
    servers: ['dev-zonda', 'qa-zonda', 'prod-zonda'],
    supports_deploy: true,
  },
  'ay-design-library': {
    devGroup: '@ay-devs',
    channel: 'team-ay-pia-web-dev',
    owner: 'codelittinc'
  },
  'ay-properties-api': {
    devGroup: '@ay-backend-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-pia-web': {
    devGroup: '@ay-desktop-devs',
    channel: 'team-ay-pia-web-dev',
    owner: 'codelittinc',
    deployChannel: 'team-pia-web-deploy',
    supports_deploy: true,
    servers: ['dev-ay-pia-web']
  },
  'ay-excel-import-api': {
    devGroup: '@ay-backend-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-excel-import-app': {
    devGroup: '@ay-backend-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-property-intelligence': {
    devGroup: '@ay-mobile-devs',
    channel: 'team-ay-pia-dev',
    deployChannel: 'team-ay-pia-deploy',
    owner: 'codelittinc',
    supports_deploy: true
  },
  'ay-users-api': {
    devGroup: '@ay-backend-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'blog-v2': {
    devGroup: '@website-devs',
    channel: 'team-website-dev',
    deployChannel: 'team-blog-deploy',
    owner: 'codelittinc',
    supports_deploy: false,
    servers: ['dev-codelitt-blog']
  },
  'test-channel': {
    channel: 'test-channel',
    owner: 'codelittinc'
  },
  'codelitt-design-system': {
    devGroup: '@design-system-devs',
    channel: 'team-codelitt-design-system-dev',
    deployChannel: 'team-design-system-deploy',
    owner: 'codelittinc',
    supports_deploy: true
  },
  'foodlitt': {
    devGroup: '@farm-to-fork-devs',
    channel: 'team-farm-to-fork-dev',
    deployChannel: 'team-farm-to-fork-deploy',
    owner: 'codelittinc',
    supports_deploy: true,
    servers: ['dev-foodlit', 'qa-foodlit', 'prod-foodlit']
  },

}

const getRepositoryData = (repositoryName) => repositoriesIdentifiers[repositoryName];
const getRepositoryDataByDeployChannel = (channel) => {
  const key = Object.keys(repositoriesIdentifiers).find(k => {
    const v = repositoriesIdentifiers[k];
    return v.deployChannel === channel;
  })

  return {
    ...(repositoriesIdentifiers[key] || {}),
    repository: key
  }
};

const getRepositoryDataByServer = (server) => {
  const key = Object.keys(repositoriesIdentifiers).find(k => {
    const v = repositoriesIdentifiers[k];
    return v.servers && v.servers.indexOf(server) >= 0;
  })

  return repositoriesIdentifiers[key];
};

const getAdminSlackUser = () => 'kaiomagalhaes';

export default {
  getRepositoryData,
  data: repositoriesIdentifiers,
  getAdminSlackUser,
  getRepositoryDataByDeployChannel,
  getRepositoryDataByServer,
};
