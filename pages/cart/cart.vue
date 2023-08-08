<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<my-address></my-address>
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		<!-- uni-swipe-action是最外层包裹性质的容器 -->
		<uni-swipe-action>
			<block v-for="(goods,i) in cart" :key="i">
				<!-- uni-swipe-action-item可以为其子节点提供滑动操作的效果。需要通过options属性来指定操作按钮的配置信息 -->
				<uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
					<!-- 在radioChangeHandle事件处理函数中，通过事件对象e,得到商品的goods_id和goods_state -->
					<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandle" @num-change="numberChangeHandle"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		<!-- 结算区域 -->
		<my-settle></my-settle>
		
	</view>
	<!-- 空白购物车区域 -->
	<view class="empty-cart" v-else>
		<image class="empty-img" src="/static/cart_empty@2x.png"></image>
		<text class="tip-text">空空如也</text>
	</view>
</template>

<script>
	// 导入自己封装的mixin模块
	import badgeMixin from '@/mixins/tabbar-badge.js';
	
	import {mapState,mapMutations} from 'vuex';
	
	export default {
		// 将badgeMxin混入到当前的页面中使用
		mixins:[badgeMixin],
		data() {
			return {
				options:[{
					text:'删除',
					style:{
						backgroundColor:'#C00000'//按钮的背景颜色
					}
				}]
			};
		},
		computed:{
			...mapState('m_cart',['cart'])
		},
		methods:{
			...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
			// 商品的勾选状态发生了改变
			radioChangeHandle(e){
				this.updateGoodsState(e);
			},
			// 商品的数量发生了改变
			numberChangeHandle(e){
				this.updateGoodsCount(e);
				// 更新mixin中的徽标
				this.setBadge();
			},
			// 点击了滑动操作按钮
			swipeActionClickHandler(goods){
				this.removeGoodsById(goods.goods_id);
				// 更新mixin中的徽标
				this.setBadge();
			}
		}
	}
</script>

<style lang="scss">
	.cart-container{
		padding-bottom: 50px;
	}
	.cart-title{
		height: 40px;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;
		.cart-title-text{
			margin-left: 10px;
		}
	}
	.empty-cart{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;
		
		.empty-img{
			width: 90px;
			height: 90px;
		}
		
		.tip-text{
			font-size: 12px;
			color: gray;
			margin-top: 15px;
		}
	}
</style>
