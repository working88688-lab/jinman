export default [
  { title: '首页', key: 'home', href: '/' },
  {
    title: '小说',
    key: 'novel',
    items: [
      {
        title: '小说首页',
        href: 'novel.html'
      },
      {
        title: '全部小说',
        href: 'novel_list.html'
      },
      {
        title: '小说排行榜',
        href: 'novel_rank.html'
      },
      {
        title: '热门小说',
        href: 'novel_common.html?type=1'
      },
      {
        title: '最新上架',
        href: 'novel_common.html?type=2'
      },
      {
        title: '最新更新',
        href: 'novel_common.html?type=3'
      }
    ],
    href: '/novel_list.html'
  },
  {
    title: '视频',
    key: 'video',
    href: '/video_list.html',
    items: [
      {
        title: '视频首页',
        href: 'video.html'
      },
      {
        title: '全部视频',
        href: 'video_list.html'
      },
      {
        title: '视频排行榜',
        href: 'video_rank.html'
      },
      {
        title: '女优排行榜',
        href: 'actress.html'
      },
      {
        title: '热门视频',
        href: 'video_common.html?type=1'
      },
      {
        title: '最新上架',
        href: 'video_common.html?type=2'
      }
    ]
  },
  {
    title: '禁漫',
    key: 'comic',
    href: '/comic_list.html',
    items: [
      {
        title: '禁漫首页',
        href: 'comic.html'
      },
      {
        title: '全部禁漫',
        href: 'comic_list.html'
      },
      {
        title: '禁漫排行榜',
        href: 'comic_rank.html'
      },
      {
        title: '热门禁漫',
        href: 'comic_common.html?type=1'
      },
      {
        title: '最新上架',
        href: 'comic_common.html?type=2'
      },
      {
        title: '最新更新',
        href: 'comic_common.html?type=3'
      }
    ]
  },
  {
    title: '黑料吃瓜',
    key: 'cg',
    href: '/cg.html'
  }
]
