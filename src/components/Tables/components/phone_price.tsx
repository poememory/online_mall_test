import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';

const Phone_price_Table = () => {
  useEffect(() => {
    const chartDom = document.getElementById('phone_price_table') as HTMLElement;
    if (!chartDom) return; // 确保能够获取到 DOM 元素

    const myChart = echarts.init(chartDom);

    const option: EChartsOption = {
      title: {
        text: '手机价格百分比分布',
        left: 'center',
        textStyle: {
          color: '#CCCCCC' // 标题颜色
        }
      },
      tooltip: {
        trigger: 'item'
      },
      color: ['#D5CBEB', '#EDEDED','#C2D5DE', '#DEDEDE'],
      series: [
        {
          name: '价格区间',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 12, name: '0~1000' },
            { value: 52, name: '1000~2500' },
            { value: 11, name: '2500~4000' },
            { value: 9, name: '4000+' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'black'
            }
          }
        }
      ]
    };

    // 设置选项
    myChart.setOption(option);

    // 在组件卸载时销毁图表，避免内存泄漏
    return () => {
      myChart.dispose();
    };
  }, []); // 空数组作为依赖，确保 useEffect 只执行一次

  return (
    <div className='onshow' style={{width:'100vw',height:'98vh',position:'relative',backgroundImage:'url(/phone_background.jpg)',backgroundSize:'cover'}}>
        <div id='phone_price_table' style={{ opacity:'0.8',width: '600px', height: '600px',position:'absolute',top:'5vh',left:'5vw' }}></div>;
    </div>
  )
  
  
};

export default Phone_price_Table;
