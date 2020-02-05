const repositoriesIdentifiers = {
  'gh-hooks-repo-test': {
    devGroup: '@elbigode',
    channel: 'test-gh',
    deployChannel: 'test-gh-deploy',
    owner: 'codelittinc',
    supports_deploy: true
  },
  'codelitt-v2': {
    devGroup: '@website-devs',
    channel: 'team-website-dev',
    deployChannel: 'team-website-deploy',
    owner: 'codelittinc',
    supports_deploy: true
  },
  'rolli': {
    devGroup: '@rolli-devs',
    channel: 'team-rolli-dev',
    deployChannel: 'team-rolli-deploy',
    owner: 'codelittinc',
    supports_deploy: true
  },
  'team-maker': {
    devGroup: '@team-maker-devs',
    channel: 'team-teammaker-dev',
    deployChannel: 'wg-teammaker-deploy',
    owner: 'codelittinc',
    supports_deploy: true
  },
  'zonda': {
    devGroup: '@zonda-devs',
    channel: 'team-zonda-dev',
    deployChannel: 'wg-zonda-deploy',
    owner: 'codelittinc'
  },
  'ay-design-library': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-design-library': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-properties-api': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-the-hub': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-excel-import-api': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-excel-import-app': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-property-intelligence': {
    devGroup: '@ay-devs',
    channel: 'team-ay-pia-dev',
    deployChannel: 'team-ay-pia-deploy',
    owner: 'codelittinc',
    supports_deploy: true
  },
  'ay-users-api': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
}

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
  victor0402: 'victor.carvalho'
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

const getSlackUser = (ghUser) => ghToSlackUsers[ghUser.toLowerCase()]
const getAdminSlackUser = () => 'kaiomagalhaes';

export default {
  getRepositoryData,
  data: repositoriesIdentifiers,
  getSlackUser,
  getAdminSlackUser,
  getRepositoryDataByDeployChannel
};