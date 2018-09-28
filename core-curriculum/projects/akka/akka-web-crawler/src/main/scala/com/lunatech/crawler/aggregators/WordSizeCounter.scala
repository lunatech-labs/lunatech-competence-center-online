package com.lunatech.crawler.aggregators

object WordSizeCounter {

  type WordSize = Int
  type WordSizeCount = Int
  val maxHistogram = 40

  /**
    * Gets the frequency count for the size of every word in the specified text.
    * @param text text to count.
    * @return a map with word size and size count.
    */
  def wordSize(text: String): Map[WordSize, WordSizeCount] =
    text.split("\\W+").map(_.size).foldLeft(Map.empty[WordSize, WordSizeCount]) { (acc, size) =>
      acc + (size -> (acc.getOrElse(size, 0) + 1))
    }

  /**
    * Prints an histogram of word count.
    * @param count word count.
    */
  def histogram(count: Map[WordSize, WordSizeCount]): Unit = {
    val maxSize = count.keySet.max
    val maxSizeLength = maxSize.toString.length
    val maxCount = count.values.max
    val header = " Count "
    val headerSize = Math.max(header.size, maxSizeLength)
    val lineSize = headerSize + 1 + maxHistogram

    // Print Header
    (0 until lineSize).foreach(_ => print('-'))
    print('\n')
    print(String.format(s"%1$$${headerSize}s", header))
    println("| Histogram ")
    (0 until lineSize).foreach(_ => print('-'))
    print('\n')

    count.keys.toSeq.sorted.foreach { size =>
      val length = ((count(size).toDouble / maxSize) * maxHistogram).toInt
      print(String.format(s"%1$$${Math.max(header.size, maxSizeLength)}s", size.toString))
      print("|")
      (0 until length).foreach(_ => print('*'))
      print('\n')
    }
  }
}
