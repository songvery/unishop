<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<my-search :bgcolor="'#c00000'" :radius="15" @click="gotoSearch"></my-search>
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height:wh+'px'}">
				<!-- 循环渲染结构时，为选中项动态添加 .active 类名 -->
				<!-- 一级分类Item项的绑定点击处理函数 -->
				<block v-for="(item,i) in cateList" :key="i">
					<view 
						:class="['left-scroll-view-item', i === active ? 'active':'']"
						@click="activeChanged(i)">
						{{item.cat_name}}
					</view>
				</block>
				
			</scroll-view>
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :style="{height:wh+'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,i2) in cateLevel2List" :key="i2">
					<view class="cate-lv2-title">
						/{{item2.cat_name}}/
					</view>
					<!-- 动态渲染三级分类的列表数据 -->
					<view class="cate-lv3-list">
						<!-- 三级分类的Item项 -->
						<view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
				
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 导入自己封装的mixin模块
	import badgeMixin from '@/mixins/tabbar-badge.js';
	
	export default {
		// 将badgeMxin混入到当前的页面中使用
		mixins:[badgeMixin],
		data() {
			return {
				// 窗口的可用高度=屏幕高度-navigationBar高度-tabBar高度-自定义的Search组件高度
				wh:0,
				// 一级分类数据列表
				cateList:[],
				// 当前选中项的索引,默认让第一项选中
				active:0,
				// 二级分类数据列表
				cateLevel2List:[],
				// 滚动条距离顶部的距离
				scrollTop:0
			};
		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo=uni.getSystemInfoSync();
			// 为wh窗口可用高度动态赋值
			this.wh=sysInfo.windowHeight-50;
			// 调用获取一级分类列表数据的方法
			this.getCateList()
		},
		methods:{
			// 获取一级分类列表数据的方法
			async getCateList(){
				const {data:res} = await uni.$http.get('/api/public/v1/categories');
				if(res.meta.status !== 200) return uni.$showMsg();
				this.cateList = res.message;
				// 为二级分类数据列表赋值
				this.cateLevel2List = res.message[0].children;
			},
			// 选中一级分类项改变的事件处理函数
			activeChanged(i){
				this.active=i;
				// 为二级分类列表重新赋值
				this.cateLevel2List = this.cateList[i].children;
				
				// 让scrollTop的值在0与1之间切换
				this.scrollTop=this.scrollTop===0?1:0;
				
				// 可以简化为如下代码
				// this.scrollTop=this.scrollTop?0:1;
			},
			// 点击三级分类项跳转到商品列表页面
			gotoGoodsList(item){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?cid='+item.cat_id
				})
			},
			// 跳转到分包中的搜索页面
			gotoSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container{
		display: flex;
		.left-scroll-view{
			width: 120px;

			.left-scroll-view-item{
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;
				position: relative;
				// 激活项的样式
				&.active{
					background-color: #ffffff;
					&::before{
						content: '';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}
		.cate-lv2-title{
			font-size: 12px;
			font-weight: bold;
			text-align: center;
			padding: 15px 0;
		}
		.cate-lv3-list{
			display: flex;
			flex-wrap: wrap;
			
			.cate-lv3-item{
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 33.33%;
				margin-bottom: 10px;
				image{
					width: 60px;
					height: 60px;
				}
				text{
					font-size: 12px;
				}
			}
		}
	}
</style>
