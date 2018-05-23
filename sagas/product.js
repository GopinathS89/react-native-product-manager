import {
    put,
    takeLatest
} from "redux-saga/effects";
import * as actionCreators from "../actionCreators/product"
import {
    GET_PRODUCTS, ADD_PRODUCT, GET_PRODUCT, DELETE_PRODUCT, SEARCH_PRODUCT
} from "../actionTypes/product";
import { Alert, Vibration } from 'react-native';

let URI = "http://172.16.104.234:4000";

function* getProducts(action) {
    try {
        let products = yield fetch(`${URI}/products?_page=${action.page}&_limit=${action.limit}`).then(r => r.json());
        yield put(actionCreators.getProductsSuccess(products))
    } catch (error) {
        yield put(actionCreators.getProductsFailure(error))
    }
}

function* getProduct(action) {
    try {
        let product = yield fetch(`${URI}/products/${action.id}`).then(r => r.json());
        yield put(actionCreators.getProductSuccess(product))
    } catch (error) {
        yield put(actionCreators.getProductFailure(error))
    }
}

function* addProduct(action) {
    try {
        let product = yield fetch(`${URI}/products`, {
            body: JSON.stringify(action.product),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
        }).then(r => r.json());
        yield put(actionCreators.addProductSuccess(product))
        yield alert()
    } catch (error) {
        yield put(actionCreators.addProductFailure(error))
    }
}

function* deleteProduct(action) {
    try {
        let product = yield fetch(`${URI}/products/${action.id}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json'
        }
        }).then(r => r.json());
        yield put(actionCreators.deleteProductSuccess(action.id))
        yield vibrate()
    } catch (error) {
        yield put(actionCreators.deleteProductSuccess(error))
    }
}

function alert() {
    Alert.alert('Success','Product Saved Successfully')
}

function vibrate() {
    Vibration.vibrate(1000);
}

function* searchProducts(action) {
    try {
        let products = yield fetch(`${URI}/products?title_like=${action.search}&_page=${action.page}&_limit=${action.limit}`).then(r => r.json());
        yield put(actionCreators.searchProductSuccess(products))
    } catch (error) {
        yield put(actionCreators.searchProductFailure(error))
    }
}

export function* productWatchers() {
    yield takeLatest(GET_PRODUCTS, getProducts);
    yield takeLatest(GET_PRODUCT, getProduct);
    yield takeLatest(ADD_PRODUCT, addProduct);
    yield takeLatest(DELETE_PRODUCT, deleteProduct);
    yield takeLatest(SEARCH_PRODUCT, searchProducts);

}