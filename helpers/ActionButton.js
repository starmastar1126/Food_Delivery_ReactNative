import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import ActionButtonItem from './ActionButtonItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
const alignItemsMap = {
  "center" : "center",
  "left"  : "flex-start",
  "right" : "flex-end"
}

const shadowHeight = 12;

export default class ActionButton extends Component {

  constructor(props) {
    super(props);

    this.state = {
      active: props.active,
    }

    this.anim = new Animated.Value(props.active ? 1 : 0);
    this.timeout = null;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }


  //////////////////////
  // STYLESHEET GETTERS
  //////////////////////

  getContainerStyles() {
    return [styles.overlay, this.getOrientation(), this.getOffsetXY()];
  }

  getActionButtonStyles() {
    return [styles.actionBarItem, this.getButtonSize()];
  }

  getOrientation() {
    return { alignItems: alignItemsMap[this.props.position] };
  }

  getButtonSize() {
    return {
      width: null,
      height: this.props.size + shadowHeight,
    }
  }

  getOffsetXY() {
    return {
      paddingHorizontal: this.props.offsetX,
      paddingBottom: this.props.offsetY
    };
  }

  getActionsStyle() {
    return [ styles.actionsVertical, this.getOrientation() ];
  }


  //////////////////////
  // RENDER METHODS
  //////////////////////

  render() {
    return (
      <View pointerEvents="box-none" style={styles.overlay}>
        <Animated.View pointerEvents="none" style={[styles.overlay, {
          backgroundColor: this.props.bgColor,
          opacity: this.anim
        }]}>
          <Text>NEED TO WORK HERE</Text>
          {this.props.backdrop}
        </Animated.View>
        <View pointerEvents="box-none" style={this.getContainerStyles()}>
          {this.state.active && this._renderTappableBackground()}

          {this.props.children && this._renderActions()}
          {this._renderButton()}
        </View>
      </View>
    );
  }

  _renderButton() {
    const buttonColorMax = this.props.btnOutRange ? this.props.btnOutRange : this.props.buttonColor;

    const animatedViewStyle = [
      styles.btn,
      { 
         width: this.anim.interpolate({
              inputRange: [0,1],
              outputRange: [this.props.size, 280]
            }),
        height: this.props.size,
        borderRadius: this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [this.props.size / 2, 5]
          }),
        backgroundColor: this.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [this.props.buttonColor, buttonColorMax]
        }),
        transform: [{
            scale: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, this.props.outRangeScale]
            }),
          }, {
            rotate: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', this.props.degrees + 'deg']
            })
          }],
      },
    ];

    if(!this.props.hideShadow) animatedViewStyle.push(styles.btnShadow);

    return (
      <View style={this.getActionButtonStyles()}>
        <TouchableOpacity
          activeOpacity={0.85}
          onLongPress={this.props.onLongPress}
          onPress={() => {
            this.props.onPress()
            if (this.props.children) this.animateButton()
          }}>
          <Animated.View
            style={animatedViewStyle}>
            {this._renderButtonIcon()}
          </Animated.View>

        </TouchableOpacity>
      </View>
    );
  }

  _renderButtonIcon() {
    const { icon, btnOutRangeTxt, buttonTextColor } = this.props;

    // if (icon) return icon;

    const buttonTextColorMax = btnOutRangeTxt ? btnOutRangeTxt : buttonTextColor;

    return (
      <Animated.Text style={[styles.btnText, {
        color: this.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [buttonTextColor, buttonTextColorMax]
        })
      }]}>
        <Icon name="arrow-forward" color='#FFFFFF' size={28}/>
      </Animated.Text>
    )
  }

  _renderActions() {
    if (!this.state.active) return null;

    let actionButtons = this.props.children

    if (!Array.isArray(this.props.children)) {
      actionButtons = [this.props.children]
    }

    return (
        <View
          style={this.getActionsStyle()}
          pointerEvents={'box-none'}
        >
        <Text style={{color: "#FFFFFF", fontSize: 16}}>Checkout</Text>
        </View>
    );
  }

  _renderTappableBackground() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        pointerEvents={this.state.active ? 'auto' : 'box-none'}
        onPress={this.reset.bind(this)}
      />
    );
  }


  //////////////////////
  // Animation Methods
  //////////////////////

  animateButton() {
    if (this.state.active) return this.reset();
    Animated.spring(this.anim, { toValue: 1 }).start();

    this.setState({ active: true });
  }

  reset() {
    if (this.props.onReset) this.props.onReset();

    Animated.spring(this.anim, { toValue: 0 }).start();

    setTimeout(() => this.setState({ active: false }), 250);
  }
}

ActionButton.Item = ActionButtonItem;

ActionButton.propTypes = {
  active: PropTypes.bool,

  position: PropTypes.string,

  hideShadow: PropTypes.bool,

  bgColor: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonTextColor: PropTypes.string,

  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  spacing: PropTypes.number,
  size: PropTypes.number,
  autoInactive: PropTypes.bool,
  onPress: PropTypes.func,
  backdrop: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
]),
  degrees: PropTypes.number
};

ActionButton.defaultProps = {
  active: false,
  bgColor: 'transparent',
  buttonColor: 'rgba(0,0,0,1)',
  buttonTextColor: 'rgba(222,81,69,1)',
  spacing: 200,
  outRangeScale: 1,
  autoInactive: true,
  onPress: () => {},
  backdrop: false,
  degrees: 0,
  position: 'right',
  offsetX: 30,
  offsetY: 30,
  size: 56,
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  actionBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    marginTop: -4,
    fontSize: 24,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  btnShadow: {
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
  },
  actionsVertical: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
});