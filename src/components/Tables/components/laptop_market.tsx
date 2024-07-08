import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';

const Laptop_market = () => {
  useEffect(() => {
    const chartDom = document.getElementById('laptop_market') as HTMLElement;
    if (!chartDom) return; // 确保能够获取到 DOM 元素

    const myChart = echarts.init(chartDom);

    const option: EChartsOption = {
      title: {
        text: '笔记本电脑市场比分布',
        left: 'center',
      },
      tooltip: {
        trigger: 'item'
      },
      color: ['#49484D','#F0F1F3', '#6B6C70', '#504C4B', '#3A414E'],
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [50, 250],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: [
            { value: 23, name: 'others' },
            { value: 16, name: 'Dell' },
            { value: 23, name: 'Lenovo' },
            { value: 10, name: 'Apple' },
            { value: 20, name: 'HP' },
            { value: 7, name: 'ACER' },
          ]
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
    <div style={{width:'100vw',height:'60vw',position:'relative',backgroundImage:'url(/laptop_market.jpg)',backgroundSize:'cover'}}>
        <div id='laptop_market' style={{ width: '800px', height: '600px',position:'absolute',top:'10vh',left:'25vw' }}></div>;
    </div>
  )
  
  
};

export default Laptop_market;
