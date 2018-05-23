import React, { Component } from "react";
import ProductListItem from "../components/ProductListItem";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
  View,
  Text
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as productActionCreators from "../actionCreators/product";
import { SearchBar } from 'react-native-elements'

let URI = "http://172.16.104.234:4000";

class ProductSearchList extends Component {
  constructor(props) {
    super(props);
  }
  _renderItem = ({ index, item }) => {
    return (
      <ProductListItem
        {...this.props}
        id={item.id}
        title={`${item.id} - ${item.title}`}
        image={item.image ? `${URI}/images/${item.image}` : null}
        rating={item.rating}
        price={item.price}
        wish={item.wish || false}
        isDelete={false}
        onWishTapped={this.onWishTapped}
      />
    );
  };

  _keyExtractor = (item, index) => {
    return `${index}`;
  };  

  /*  flat list supporting methods - END */

  render() {
    return (
        <View style={{flex:1,backgroundColor:'#fff'}}>
        <SearchBar
          lightTheme
          clearIcon={{ color: 'red' }}
          onChangeText={(text)=> this.props.actions.searchProduct(text, page=1, limit=20)}
          onClearText={()=>{}}
          placeholder='Search by product name' />  
          {
              this.props.isLoading ? (
            <ActivityIndicator size="large" color="#00ff80" />
          ) : (
              this.props.searchProducts && this.props.searchProducts.length > 0?
            <FlatList
              data={this.props.searchProducts}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              onEndReachedThreshold={0.5}
              onEndReached={this._getMore}
            /> 
            :
            <View style={{flex: 1,
                justifyContent: 'center',
                alignItems: 'center'}}>
                <Text style={{justifyContent: 'center',alignItems: 'center' }}>No results found</Text>
              </View>
          )}
        </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.productState.isLoading,
    page: state.productState.page,
    limit: state.productState.limit,
    searchProducts: state.productState.searchProducts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(productActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductSearchList);
