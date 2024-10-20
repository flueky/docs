---
title: "Java压缩zip格式文件"
date: 2016-04-13 19:58:56 +0800
categories: 
 - Java
tag:
---


三个主要的类：

- import java.util.zip.ZipFile;//打开zip格式文件。
- import java.util.zip.ZipEntry; //标记被压缩文件的属性，主要是文件名和路径。
- import java.util.zip.ZipOutputStream;//zip格式输出流。
	
>压缩文件夹时，需要挨个节点，递归压缩文件夹中所有的文件。

代码如下：

```Java
	public static void zipFile(String filePath, String zipPath) {
		try {
			File inFile = new File(filePath);
			File outFile = new File(zipPath);
			FileOutputStream fos = new FileOutputStream(outFile);
			ZipOutputStream zos = new ZipOutputStream(fos);
			zipFile(filePath, inFile, zos);
			zos.close();
			fos.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * 压缩文件夹
	 * @author flueky flueky@sina.com
	 * @date 2016年4月13日 下午7:47:11
	 * @param folderPath
	 * @param zipPath
	 */
	public static void zipFolder(String folderPath, String zipPath) {

		try {
			File inFile = new File(folderPath);
			File outFile = new File(zipPath);
			FileOutputStream fos = new FileOutputStream(outFile);
			ZipOutputStream zos = new ZipOutputStream(fos);
			zipFile(folderPath, inFile, zos);
			zos.close();
			fos.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * 递归压缩文件
	 * @author flueky flueky@sina.com
	 * @date 2016年4月13日 下午7:47:28
	 * @param folderPath
	 * @param file
	 * @param zos
	 */
	private static void zipFile(String folderPath, File file, ZipOutputStream zos) {

		int index = folderPath.lastIndexOf(File.separator);
		
		try {
			if (file.isDirectory()) {// 文件夹,递归遍历文件夹下文件压缩
				File[] files = file.listFiles();
				if (files != null) {
					for (File f : files)
						zipFile(folderPath, f, zos);
				}
				return;
			}
			zos.putNextEntry(new ZipEntry(file.getAbsolutePath().substring(index)));
			byte[] buffer = new byte[1024];
			int length = -1;
			FileInputStream fis = new FileInputStream(file);
			while ((length = fis.read(buffer)) != -1) {
				zos.write(buffer, 0, length);
			}
			fis.close();

		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	/**
	 * 解压文件.zip格式
	 * 
	 * @author flueky flueky@sina.com
	 * @date 2016年4月13日 下午3:12:23
	 * @param zipFilePath
	 * @param outFolderPath
	 */
	public static void unzipFile(String zipFilePath, String outFolderPath) {

		try {
			ZipFile zipFile = new ZipFile(zipFilePath);

			Enumeration<ZipEntry> zList = (Enumeration<ZipEntry>) zipFile.entries();
			while (zList.hasMoreElements()) {
				ZipEntry zipEntry = zList.nextElement();
				if (zipEntry.getName().startsWith("__MACOSX"))// Mac
																// 系统自带压缩工具生成,屏蔽
					continue;
				if (!zipEntry.isDirectory()) {// 只解压文件
					InputStream is = zipFile.getInputStream(zipEntry);
					StringBuffer name = new StringBuffer(outFolderPath);
					if (name.lastIndexOf(File.separator) != name.length() - 1) {
						name.append(File.separator);
					}
					name.append(zipEntry.getName());
					File outFile = new File(name.toString());
					if (!outFile.getParentFile().exists())
						outFile.getParentFile().mkdirs();
					outFile.createNewFile();
					FileOutputStream fos = new FileOutputStream(outFile);
					int length = -1;
					byte[] buffer = new byte[1024];
					while ((length = is.read(buffer)) != -1) {
						fos.write(buffer, 0, length);
					}
					// 关闭流
					is.close();
					fos.close();
				}

			}
			zipFile.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
```