<template>
	<view>
		<view class="goods-item">
			<!-- 商品左侧图片区域 -->
			<view class="goods-item-left">
				<radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioChangeHandler"></radio>
				<image :src="goods.goods_small_logo||defaultPic" class="goods-pic"></image>
			</view>
			<!-- 商品右侧信息 -->
			<view class="goods-item-right">
				<!-- 商品标题 -->
				<view class="goods-name">{{goods.goods_name}}</view>
				<view class="goods-info-box">
					<!-- 商品价格 -->
					<view class="goods-price">￥{{goods.goods_price | toFixed}}</view>
					<!-- 商品数量 -->
					<uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-goods",
		// 定义props属性，用来接收外界传递到当前组件的数据
		props:{
			// 商品信息对象
			goods:{
				type:Object,
				default:{}
			},
			// 是否展示图片左侧的radio
			showRadio:{
				type:Boolean,
				// 如果外界没指定showRadio属性的值，则默认不展示Radio组件
				default:false
			},
			// 是否展示价格右侧的NumberBox组件
			showNum:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				// 默认的空图片
				defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		filters:{
			// 把数字处理为带两位小数点的数字
			toFixed(num){
				return Number(num).toFixed(2)
			}
		},
		methods:{
			// radio组件的点击事件处理函数
			radioChangeHandler(){
				// 通过this.$emit()触发外界通过@绑定的radio-change事件，
				// 同时把商品的id和勾选状态作为参数传递给radio-change事件处理函数
				this.$emit('radio-change',{
					goods_id:this.goods.goods_id,
					goods_state:!this.goods.goods_state
				});
			},
			// NumberBox组件的change事件处理函数
			numChangeHandler(value){
				console.log('####',value)
				// 通过this.$emit()触发外界通过@绑定的num-change事件
				this.$emit('num-change',{
					goods_id:this.goods.goods_id,
					// 商品数量
					goods_count:+value
				});
			}
		}
	}
</script>

<style lang="scss">
	.goods-item{
		// 让goods-item项占满整个屏幕的宽度
		width: 750rpx;
		// 设置盒模型为border-box
		box-sizing: border-box;
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;
		.goods-item-left{
			margin-right: 5px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.goods-pic{
				width: 100px;
				height: 100px;
				display: block;
			}
		}
		.goods-item-right{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.goods-name{
				font-size: 13px;
			}
			.goods-info-box{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.goods-price{
					font-size: 16px;
					color: #c00000;
				}
			}
			
		}
	}
</style>