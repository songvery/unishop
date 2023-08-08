<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>
		<!-- 轮播图区域 -->
		<swiper indicator-dots autoplay :interval="3000" :duration="1000" circular>
			<swiper-item v-for="item in swiperList" :key="item.goods_id">
				<!-- <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id"> -->
				<navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
			
		</swiper>
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src"></image>
			</view>
		</view>
		<!-- 楼层区域 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<image class="floor-title" :src="item.floor_title.image_src"></image>
				<!-- 楼层中的图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大图片的盒子 -->
					<view class="left-img-box">
						<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</view>
					<!-- 右侧4个小图片的盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2,y) in item.product_list" :key="y" v-if="y !== 0" :url="item2.url">
							<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
						</navigator>
					</view>
				</view>
			</view>
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
				// 轮播图的数据列表
				swiperList:[],
				// 分类导航的数据列表
				navList:[],
				// 楼层数据列表
				floorList:[],
			};
		},
		onLoad() {
			// 在小程序页面刚加载的时候,调用获取轮播图数据的方法
			this.getSwiperList();
			// 页面加载时,调用获取分类导航的方法
			this.getNavList();
			// 页面加载时,调用获取楼层数据的方法
			this.getFloorList();
		},
		methods:{
			// 获取轮播图数据的方法
			async getSwiperList(){
				// 发起网络请求
				const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata');
				
				// 请求失败
				/* if(res.meta.status !== 200){
					return uni.showToast({
						title:'数据请求失败',
						duration:1500,
						icon:'none'
					})
				} */
				if(res.meta.status !== 200) return uni.$showMsg()
				// 请求成功,为data 中的数据赋值
				this.swiperList = res.message;
			},
			// 获取分类导航数据的方法
			async getNavList(){
				const {data:res} = await uni.$http.get('/api/public/v1/home/catitems');
				if(res.meta.status !== 200) return uni.$showMsg();
				this.navList = res.message;
			},
			// 分类导航项被点击时的事件处理函数
			navClickHandler(item){
				// 判断点击的是哪个导航
				if(item.name === '分类'){
					uni.switchTab({
						url:'/pages/cate/cate'
					})
				}
			},
			// 定义获取楼层列表数据的方法
			async getFloorList(){
				const {data:res}=await uni.$http.get('/api/public/v1/home/floordata');
				console.log('$$$',res);
				if(res.meta.status !== 200) return uni.$showMsg();
				// 通过双层forEach循环,处理URL地址
				res.message.forEach((floor)=>{
					// floor.product_list.forEach(function b(product){
					floor.product_list.forEach((product)=>{
						// navigator_url:/pages/goods_list?query=服饰
						product.url = '/subpkg/goods_list/goods_list?'+product.navigator_url.split('?')[1];
					});
				});
				this.floorList = res.message;
			},
			// 跳转到分包中的搜索页面
			gotoSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		},
		
	}
</script>

<style lang="scss">
	swiper{
		height: 330rpx;
		.swiper-item,image{
			width: 100%;
			height: 100%;
		}
	}
	.nav-list{
		display: flex;
		justify-content: space-around;
		margin: 15px 0;
		.nav-item image{
			width: 128rpx;
			height: 140rpx;
		}
	}
	.floor-list{
		.floor-item{
			.floor-title{
				height: 60rpx;
				width: 100%;
				display: flex;
			}
		}
	}
	.floor-img-box{
		display: flex;
		padding-left: 10rpx;
	}
	.right-img-box{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	.search-box{
		// 设置定位效果为吸顶
		position: sticky;
		// 吸顶的位置
		top:0;
		// 提高层级，防止轮播图覆盖
		z-index: 999;
	}
</style>
