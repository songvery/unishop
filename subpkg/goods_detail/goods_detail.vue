<template>
	<!-- 解决商品价格闪烁 -->
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- 商品轮播图 -->
		<swiper :indicator-dots="true" autoplay :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,i) in goods_info.pics" :key="i">
				<!-- 把当前点击的图片索引，传递到preview()处理函数中 -->
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view>
			<!-- 信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名称 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
		</view>
		<!-- 商品详情信息区域 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		<!-- 商品导航组件 -->
		<view class="goods-nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick"></uni-goods-nav>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品详情对象
				goods_info:{},
				// 左侧按钮组的配置对象
				options:[{
					icon:'shop',
					text:'店铺'
				},{
					icon:'cart',
					text:'购物车'
				}],
				// 右侧按钮组的配置对象
				buttonGroup:[{
					text:'加入购物车',
					backgroundColor:'#ff0000',
					color:'#fff',
					// 自己添加的属性
					name:'addCart'
				},{
					text:'立即购买',
					backgroundColor:'#ffa200',
					color:'#fff',
					name:'buy'
				}]
			};
		},
		onLoad(options) {
			// 获取商品ID
			const goods_id = options.goods_id;
			// 调用请求商品详情数据的方法
			this.getGoodsDetail(goods_id);
		},
		methods:{
			// 定义请求商品详情数据的方法
			async getGoodsDetail(goods_id){
				const {data:res} = await uni.$http.get('/api/public/v1/goods/detail',{goods_id});
				if(res.meta.status != 200) return uni.$showMsg();
				// 使用字符串的replace()方法，为img标签添加行内样式，从而解决图片底部空白间隙的问题
				// 解决.webp格式图片在IOS设备上无法正常显示的问题
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,'<img style="display:block" ').replace(/webp/g,'jpg');
				this.goods_info = res.message;
			},
			// 实现轮播图的预览效果
			preview(i){
				// 调用uni.previewImage()方法预览图片
				uni.previewImage({
					// 预览时，默认显示图片的索引
					current:i,
					// pics所有图片url地址的数组
					// urls:this.goods_info.pics.map(function(x){return x.pics_big})
					urls:this.goods_info.pics.map(x=>x.pics_big)
				})
			},
			// 商品导航左侧按钮的点击事件处理函数
			onClick(e){
				// if(e.content.text === '购物车'){
				if(e.content.icon === 'cart'){
					// 切换到购物车界面
					uni.switchTab({
						url:'/pages/cart/cart'
					});
				}
			},
			// 商品导航右侧按钮的点击事件处理函数
			buttonClick(e){
				console.log(e);
			}
		}
	}
</script>

<style lang="scss">
	.goods-detail-container{
		// 给页面外层的窗口添加50PX的padding
		// 防止页面内容被底部的商品导航组件遮盖
		padding-bottom: 50px;
	}
	swiper{
		height: 750rpx;
		image{
			height: 100%;
			width: 100%;
		}
	}
	.goods-info-box{
		padding: 10px;
		padding-right: 0;
		.price{
			color: #c00000;
			font-size: 18px;
			margin: 10px 0;
		}
		.goods-info-body{
			display: flex;
			justify-content: space-between;
			.goods-name{
				font-size: 13px;
				padding-right: 10px;
			}
			.favi{
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-left: 1px solid #efefef;
				color: gray;
			}
		}
		.yf{
			margin: 10px 0;
			font-size: 12px;
			color: gray;
		}
	}
	.goods-nav{
		// 为商品导航组件添加固定定位
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
</style>
