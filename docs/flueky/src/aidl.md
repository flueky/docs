---
title: "Android平台的跨进程通信——AIDL（上）"
date: 2016-04-26 15:31:57 +0800
categories: 
 - Android
tag:
 - AIDL
---

# 什么是AIDL

AIDL:**Android Interface Definition Language**,即Android接口定义语言。Android系统中的进程之间不能共享内存，因此，需要提供一些机制在不同进程之间进行数据通信，AIDL应运而生。

有些Android小伙伴也许就不服了，认为用Intent不就可以了？跳转Activity 和发送BroadCast都可以用intent传递数据。Content Provider的功能更是毋庸置疑。如:获取手机联系人就是系统应用提供的接口。**关于Content Provider的原理在后续文章中会讲解。**那么只剩Service，机智的小伙伴已经猜想到AIDL就和Service有关。

# AIDL开发步骤

- 定义aidl文件
- 定义Service
- 实现客户端

>关于更多AIDL的概念还请自行Google。虽说实践要和理论结合，把那千篇一律的理论粘贴过来，不符合笔者的风格也浪费读者的时间。喜欢上图、上代码，够简单够粗暴……

# 新建AIDL文件

- 定义了AIDLDemo 和AIDLDemoService两个工程
- 两个工程里的aidl文件相同，并且是在同名目录下。会对应生成java文件。

<img src="/assets/image/212/1.png" width="400"/>

<img src="/assets/image/212/2.png" width="350"/>

<img src="/assets/image/212/3.png" width="450"/>

<img src="/assets/image/212/4.png" width="450"/>

>根据aidl文件生成的java类，eclipse在gen目录下，AndroidStudio在app/build目录下。

```Java
/*
 * This file is auto-generated.  DO NOT MODIFY.
 * Original file: /AIDLDemo/src/com/flueky/aidl/FluekyAidlInterface.aidl
 */
package com.flueky.aidl;
// Declare any non-default types here with import statements

public interface FluekyAidlInterface extends android.os.IInterface
{
/** Local-side IPC implementation stub class. */
public static abstract class Stub extends android.os.Binder implements com.flueky.aidl.FluekyAidlInterface
{
private static final java.lang.String DESCRIPTOR = "com.flueky.aidl.FluekyAidlInterface";
/** Construct the stub at attach it to the interface. */
public Stub()
{
this.attachInterface(this, DESCRIPTOR);
}
/**
 * Cast an IBinder object into an com.flueky.aidl.FluekyAidlInterface interface,
 * generating a proxy if needed.
 */
public static com.flueky.aidl.FluekyAidlInterface asInterface(android.os.IBinder obj)
{
if ((obj==null)) {
return null;
}
android.os.IInterface iin = obj.queryLocalInterface(DESCRIPTOR);
if (((iin!=null)&&(iin instanceof com.flueky.aidl.FluekyAidlInterface))) {
return ((com.flueky.aidl.FluekyAidlInterface)iin);
}
return new com.flueky.aidl.FluekyAidlInterface.Stub.Proxy(obj);
}
@Override public android.os.IBinder asBinder()
{
return this;
}
@Override public boolean onTransact(int code, android.os.Parcel data, android.os.Parcel reply, int flags) throws android.os.RemoteException
{
switch (code)
{
case INTERFACE_TRANSACTION:
{
reply.writeString(DESCRIPTOR);
return true;
}
case TRANSACTION_basicTypes:
{
data.enforceInterface(DESCRIPTOR);
int _arg0;
_arg0 = data.readInt();
long _arg1;
_arg1 = data.readLong();
boolean _arg2;
_arg2 = (0!=data.readInt());
float _arg3;
_arg3 = data.readFloat();
double _arg4;
_arg4 = data.readDouble();
java.lang.String _arg5;
_arg5 = data.readString();
this.basicTypes(_arg0, _arg1, _arg2, _arg3, _arg4, _arg5);
reply.writeNoException();
return true;
}
}
return super.onTransact(code, data, reply, flags);
}
private static class Proxy implements com.flueky.aidl.FluekyAidlInterface
{
private android.os.IBinder mRemote;
Proxy(android.os.IBinder remote)
{
mRemote = remote;
}
@Override public android.os.IBinder asBinder()
{
return mRemote;
}
public java.lang.String getInterfaceDescriptor()
{
return DESCRIPTOR;
}
/**
     * Demonstrates some basic types that you can use as parameters
     * and return values in AIDL.
     */
@Override public void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat, double aDouble, java.lang.String aString) throws android.os.RemoteException
{
android.os.Parcel _data = android.os.Parcel.obtain();
android.os.Parcel _reply = android.os.Parcel.obtain();
try {
_data.writeInterfaceToken(DESCRIPTOR);
_data.writeInt(anInt);
_data.writeLong(aLong);
_data.writeInt(((aBoolean)?(1):(0)));
_data.writeFloat(aFloat);
_data.writeDouble(aDouble);
_data.writeString(aString);
mRemote.transact(Stub.TRANSACTION_basicTypes, _data, _reply, 0);
_reply.readException();
}
finally {
_reply.recycle();
_data.recycle();
}
}
}
static final int TRANSACTION_basicTypes = (android.os.IBinder.FIRST_CALL_TRANSACTION + 0);
}
/**
     * Demonstrates some basic types that you can use as parameters
     * and return values in AIDL.
     */
public void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat, double aDouble, java.lang.String aString) throws android.os.RemoteException;
}

```

分析代码段记住如下三点：
 1. 内部类：Stub
 2. 静态方法：asInterface
 3. aidl文件里声明的方法（这里指**basicTypes**）

# 写Server端

AidlService类

```Java
package com.flueky.aidldemoservice;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

import com.flueky.aidl.FluekyAidlInterface;

public class AidlService extends Service {
    public AidlService() {

    }

    @Override
    public IBinder onBind(Intent intent) {
        return new Stub();
    }

    private class Stub extends FluekyAidlInterface.Stub {

        /**
         * Demonstrates some basic types that you can use as parameters
         * and return values in AIDL.
         *
         * @param anInt
         * @param aLong
         * @param aBoolean
         * @param aFloat
         * @param aDouble
         * @param aString
         */
        @Override
        public void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat, double aDouble, String aString) throws RemoteException {
            Log.d("TAG", anInt + " " + aLong + " " + aBoolean + " " + aFloat + " " + aDouble + " " + aString);
        }
    }
}
```

AndroidManifest.xml

```Xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.flueky.aidldemoservice">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <service
            android:name=".AidlService"
            android:enabled="true"
            android:exported="true">
            <intent-filter>
                <action android:name="com.flueky.aidl.action.aidl"/>
            </intent-filter>
        </service>
    </application>

</manifest>
```

>记住Server端的包名**com.flueky.aidldemoservice**和AidlService的action **com.flueky.aidl.action.aidl**。

# 写client端

MainActivity类

```Java
package com.flueky.aidldemo;

import com.flueky.aidl.FluekyAidlInterface;

import android.app.Activity;
import android.app.Service;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

public class MainActivity extends Activity {

	private FluekyAidlInterface aidlInterface;

	private ServiceConnection conn = new ServiceConnection() {

		@Override
		public void onServiceDisconnected(ComponentName name) {

		}

		@Override
		public void onServiceConnected(ComponentName name, IBinder service) {
			// 获取aidl对象
			aidlInterface = FluekyAidlInterface.Stub.asInterface(service);
			
			try {
				Log.d("TAG", "开始调用");
				aidlInterface.basicTypes(1, 2, false, 1.2f, 1.3, "flueky");
				Log.d("TAG", "调用结束");
				
			} catch (RemoteException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	};

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

		Intent intent = new Intent("com.flueky.aidl.action.aidl");
		// android 5.0 不支持隐式跳转，需要指定包名
		intent.setPackage("com.flueky.aidldemoservice");
		// 绑定服务
		bindService(intent, conn, Service.BIND_AUTO_CREATE);

	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		unbindService(conn);
	}
}

```

- 在MainActivity中通过action 和应用包名（Android 5.0以上不支持隐式跳转）绑定AIDL的Service。
- 通过静态方法asInterface 获取aidl接口的实例。
- 通过实例调用在aidl文件中声明的方法。

# 检查结果

关键代码块
```Java
    // 获取aidl对象
    aidlInterface = FluekyAidlInterface.Stub.asInterface(service);
    
    try {
        Log.d("TAG", "开始调用");
        aidlInterface.basicTypes(1, 2, false, 1.2f, 1.3, "flueky");
        Log.d("TAG", "调用结束");
        
    } catch (RemoteException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }
```

```Java
    @Override
    public void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat, double aDouble, String aString) throws RemoteException {
        Log.d("TAG", anInt + " " + aLong + " " + aBoolean + " " + aFloat + " " + aDouble + " " + aString);
    }
```

<img src="/assets/image/212/5.png" width="450"/>

分析运行结果，已成功将基本类型数据传递至Server端，关于传递对象数据和Sever端将数据传回Client端，将在下一篇讲解。
