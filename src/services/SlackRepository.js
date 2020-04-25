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
}

const jiraToSlackUsers = {
  '5c06bd73ed04de3e5b754509': 'gabriel',
  '5e6648d0219fb10cf9ed9c8d': 'matias',
  '5c73e558a610e635fa0fad26': 'vincent',
  '5e67dba377d46c0cf93af7f0': 'ian.campelo',
  '5a0f40fb3f50ba4cff298870': 'vicky',
  '5db84b746bd41c0c358f6c3b': 'victor.carvalho',
  '5b69bc7185ee4d3d958601f2': 'alex',
  '5c73de34ef824a130638f5c4': 'manu',
  '5bfc2cb5b5881d1b2e50a6da': 'kaiomagalhaes',
  '5e0f6ec2800be30d9fb9d25b': 'raphael.sattler',
  '5e42f0c5ab90210c8de08a1d': 'pedro.guimaraes',
  '5b07b8b1a06f955a66946e42': 'pablo',
  '5cc06a9f2f51be0e56a1b2b8': 'vincent.gschwend',
  '5e54a16d4befbd0c96c9eca5': 'denys.zayets',
  '5e53d6192a59dc0c8fe5e055': 'anthony.scinocco',
  '5e4bef0f052b790c975095e0': 'divjot.mehton',
  '5b167e5dc2fc1b1bc37bb16c': 'alessandro.alves',
  '5e6aa4e72a0bb00ce03419be': 'manuel.lajo',
  '5e6f922e5ffd840c43a99308': 'mauricio.villaalba',
  '5ca6158010e4f967c3022b24': 'ana.marija',
};

const ghToSlackUsers = {
  kaiomagalhaes: 'kaiomagalhaes',
  alesmit: 'alex',
  alessandromontividiu03: 'alessandro.alves',
  diogoribeiro: 'diogo',
  gabrielpanga: 'gabriel',
  lua121: 'lua',
  neonima: 'vinny',
  paulohfev: 'paulo.fernandes',
  presnizky: 'pablo',
  raphaelsattler: 'raphael.sattler',
  tolastarras: 'rafael.sobrino',
  victor0402: 'victor.carvalho',
  ascinocco: 'anthony.scinocco',
  mvillalba2016: 'mauricio.villaalba',
  pvieiraguimaraes: 'pedro.guimaraes',
  'Manuel-Lajo-Salazar': 'manuel.lajo',
  jacksonpires: 'jackson.pires'
};

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

const getSlackUser = (ghUser) => ghToSlackUsers[ghUser.toLowerCase()]
const getAdminSlackUser = () => 'kaiomagalhaes';

export default {
  getRepositoryData,
  data: repositoriesIdentifiers,
  getSlackUser,
  getAdminSlackUser,
  getRepositoryDataByDeployChannel,
  getRepositoryDataByServer,
};
