---
title: "仿QQ空间的透明标题头"
date: 2017-11-03 23:55:53 +0800
categories: 
 - Android
tag:
---

## 1 目标


先看看QQ空间的样式。

**透明背景标题头**

<img src="/assets/image/235/1.jpg" height="650"/>

**白色背景标题头**

<img src="/assets/image/235/2.jpg" height="650"/>

## 2 思路

滚动页面时，当背景头部消失后，标题背景变成白色。即计算滑动距离，根据距离计算需要变更标题背景的时机，标题浮动在滚动视图上面。布局有两种设计方法:

方案一：

```Xml
<RelativeLayout>
    <ScrollView>
        <!-- 滚动视图内容 -->
        <LinearLayout>
        
        </LinearLayout>
    </ScrollView>
    <!-- 标题 -->
    <LinearLayout>
    
    </LinearLayout>
</RelativeLayout>
```

> 优点：标题独立于滚动视图，无需处理
> 缺点：滚动视图拉伸时，影响一体化体验

方案二：

```Xml
<ScrollView>
    </RelativeLayout>
        <!-- 滚动视图内容 -->
        <LinearLayout>
        
        </LinearLayout>
        <!-- 标题 -->
        <LinearLayout>
    
        </LinearLayout>
    <RelativeLayout>
</ScrollView>
```

> 优点：滚动视图拉伸时，标题一起下滑。
> 缺点：标题同滚动视图一起滑动，需要单独处理。

**这里，选择方案二的理由是，解决方案二的缺点比解决方案一的缺点容易很多。**

## 3 实现

重写`ScrollView`,监听滑动距离，保持标题布局不变，并根据时机改变背景。

```Java
@Override
protected void onScrollChanged(int l, int t, int oldl, int oldt) {
    super.onScrollChanged(l, t, oldl, oldt);
    if (titleView == null)
        throw new IllegalStateException("titleView 不能为空");
    if (headView == null)
        throw new IllegalStateException("headView 不能为空");
    titleView.setTranslationY(t);//这里使标题视图不随ScrollView滚动
    /**
        * 根据滚动距离计算
        */
    if (headView.getHeight() - t < titleView.getHeight() * 1.2f) {
        // 乘以倍数扩大处罚范围
        if (isHeadShow && mScrollStateListener != null) {
            // 标题显示到消失，才执行
            mScrollStateListener.changed(!isHeadShow);
        }
        isHeadShow = false;
    } else if (headView.getHeight() - t > titleView.getHeight() * 1.8f) {
        // 乘以倍数扩大处罚范围
        if (!isHeadShow && mScrollStateListener != null) {
            // 标题消失到显示，才执行
            mScrollStateListener.changed(!isHeadShow);
        }
        isHeadShow = true;
    }
    
    if (mScrollStateListener != null) {
        // 计算头部视图显示的百分比
        float percent = 0;
        if (t <= headView.getHeight() - titleView.getHeight())
            percent = 1 - t * 1.0f / (headView.getHeight() - titleView.getHeight());
        else if (t < 0)
            percent = 1;
        else percent = 0;

        /**
            * 0.001 处理浮点数计算存在的误差
            */
        if (Math.abs(1 - percent) < 0.001) {
            lastPercent = percent;
            percent = 1;
            mScrollStateListener.openPercent(percent);
        } else if (Math.abs(percent) < 0.001) {
            lastPercent = percent;
            percent = 0;
            mScrollStateListener.openPercent(percent);
        }
        //两次变化百分比小于0.1时，不作处理
        if (Math.abs(lastPercent - percent) < 0.1)
            return;
        mScrollStateListener.openPercent(percent);
    }
}
```

事实告诉你，实现起来很容易，重写这一个方法就好。

> 由于重写这个ScrollView的目的是修改标题背景，因此`headView`和`titleView`不能为空。它们存在的意义在于，获取它们的高度，根据高度和滑动距离计算变更标题背景的时机，和保持标题视图的稳定不变。


```Java
/**
    * 滚动状态监听
    */
public interface ScrollStateListener {
    /**
        * 背景图片完全显示时，openPercent 值是 1
        */
    public void openPercent(float openPercent);
    /**
        * 背景图片完全显示时，isOpen 值是 true
        */
    public void changed(boolean isOpen);
}
```

在`changed`方法中，根据`isOpen`就可以实现QQ空间的效果。但功能并不限于此。还可以根据`openPercent`方法值的变化，给标题背景设置渐变过度效果。

## 4 结束语

这个效果可以很方便的同当下流行的下拉刷新组件结合。详情见[GitHub:flueky/Android-PullToRefresh](https://github.com/flueky/Android-PullToRefresh)

附上结合使用后的效果图：

<img src="/assets/image/235/3.gif" height="650"/>
