module.exports = {
  title: '象传云盘',
  base: '/qiniuClient/',
  description: 'qiniuClient docs',
  themeConfig: {
    logo: '/assets/img/logo.jpg',
    lastUpdated: 'Last Updated',
    nav: [{ text: 'github', link: 'https://www.iqka.com' }],
    displayAllHeaders: true,
    sidebarDepth: 1,
    sidebar: [
      {
        title: '', // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: ['/', ['/CHANGLOG', '更新日志'], ['/ISSUE', '问题']]
      }
    ]
  }
}
