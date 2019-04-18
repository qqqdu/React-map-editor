// /*
// *  混合 connect到各个组件。
// *  如果想要调用store里面的数据必须要被connect
// */
// import * as React from 'react';
// import { connect } from 'react-redux'
// import { is, fromJS} from 'immutable';
// import *as action from '../Redux/Action/index';

// export const template = mySeting => {
// 	 let seting = {
//         id: '', //应用唯一id表示
//         url: '', //请求地址
//         data: {}, //发送给服务器的数据
//         component: <div></div>, //数据回调给的组件
//     };
//     for(let key in mySeting){
//     	seting[key] = mySeting[key];
//     }
//     class Index extends React.Component {
//     	static defaultProps = { seting }
    	
//     	constructor (props, context){
//     		super(props, context)
//     	}

//     	render() {
//             return <this.props.seting.component {...this.props} state={this.props.state.toJS()}/>;  // 把immutabel类型再转为js类型
//         }
//     }
//     // Index其实是顶级组件，包括了其他模板组件，connect将其与其他路由组件链接起来
     
//      return connect(state => { 
        
//         let {loginOrNot, mailList, unRead, mailWords} = state;
//         //console.log(loginOrNot,mailList,state)
//         console.log(loginOrNot,mailList,unRead)
//         return { 
//         	state: state['fetchData'],
//             loginOrNot,
//             mailList,
//             unRead,
//             mailWords
//         } 
//     }, action)(Index); //连接redux
// } 

