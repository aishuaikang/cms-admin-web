module.exports = {
  // 继承的规则
  extends: ['@commitlint/config-conventional'],
  // 定义规则类型
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build', // 打包
        'ci', // 持续集成
        'wip', // 开发中
        'types', // 类型定义
        'merge', // 合并分支
        'release', // 发布新版本
      ],
    ],
    // subject 大小写不做校验
    'subject-case': [0],
    // subject 不能为空
    'subject-empty': [2, 'never'],
    // subject 最小长度
    'subject-min-length': [2, 'always', 3],
    // body 以空行开头
    'body-leading-blank': [2, 'always'],
    // footer 以空行开头
    'footer-leading-blank': [2, 'always'],
    // header 最大长度
    'header-max-length': [2, 'always', 72],
    // type 不能为空
    'type-empty': [2, 'never'],
    // type 大小写不做校验
    'type-case': [0],
  },
};
