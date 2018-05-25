export const FIELD = [
  {
    label:'日期',
    value:'eventTime'
  },
  {
    label:'日志ID',
    value:'_id'
  },
  {
    label:'日志级别',
    value:'level'
  },
  {
    label:'来源',
    value:'host'
  },
  {
    label:'所在类',
    value:'class'
  },
  {
    label:'系统',
    value:'system'
  },
  {
    label:'模块',
    value:'module'
  },
  {
    label:'任务',
    value:'task'
  },
  {
    label:'结果',
    value:'result'
  },
  {
    label:'耗时',
    value:'costTime'
  },
  {
    label:'信息',
    value:'information'
  },
  {
    label:'错误',
    value:'error'
  }];
export const field_EN2CN = (field) => {
  let chinese = '';
  FIELD.forEach( item => {
    if (item.value === field){
      chinese = item.label;
    }
  });
  return chinese;
};

export const OPERATOR = [
  {
    label:'等于',
    value:'is'
  },
  {
    label:'不等于',
    value:'not'
  },
  {
    label:'之间',
    value:'between'
  },
  {
    label:'小于',
    value:'less'
  },
  {
    label:'大于',
    value:'more'
  }
];
export const operator_EN2CN = (operator) => {
  let chinese = '';
  OPERATOR.forEach( item => {
    if (item.value === operator){
      chinese = item.label;
    }
  });
  return chinese;
};
