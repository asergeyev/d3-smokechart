# Preparing Smokedata Files

This directory contains auto-generated and live-capture data of "response times"
for use with the **smokechart** plotting package from [Alex Sergeyev](https://github.com/asergeyev/d3-smokechart).

The **smokedata** format is a Javascript array of arrays.
Smokedata rows can contain any number of data points,
or no points at all, represented by an empty array [].
The contents of a row must be numeric integer or floating point values.
Missing data points may be represented by the Javascript value *NaN*.
(Missing values might be caused by an event that prevented the sample
from being recorded, for example, if no response was received for a ping-request packet.)

The expected use case for smokedata is to represent several day's (a few hundred hours)
of data, one hour per row,
each row containing up to 120 values (a sample every 30 seconds).
The X-axis of the resulting smokechart would show each hour's results, where the Y-axis shows the distribution of samples. 
However, smokedata can represent any set of data samples where each row
represents a collection of values to be summarized in a single vertical slice on the X-axis of the chart.

There is no timestamp meta-data included in the smokedata format.
The producer of the data is responsible for keeping track of the times
associated with the smokedata.

Because the smokedata represents a historical record, it will never change.
The **smokechart** package may have functions for reducing the size of the
array into a **smokebands array** to avoid re-computation of median, percentile error bands, etc.

## Source Files (src)

This directory contains several Javascript programs to programmatically generate smokedata for testing.

* **perfectcone.js** - Generate 24 rows of data containing samples centered around a median value.
The first row has only the median value, the second has 3 values [med-1, med, med+1], the third row five values,
and so on to the 24th row with 49 values in the range [med-24..med+24]
The expected plot will be a uniform "cone" with the earliest value only
showing a line, and an even distribution of "bands".

* **conedata.js** - Generate 24 rows containing 120 samples of data
randomly distributed around a median value.
The spread of the generated data should be similar to that of the perfect cone, but the randomness will introduce variations.

* **samples-to-smokedata.js** - Read a file of (numeric) readings,
one per line, (these might be every-30-second samples)
and output rows containing 120 samples as a Javascript array.
The output filename is the same as the input's with a **.json** suffix.

## Raw Data Samples

This top-level *Raw Data Samples* directory holds live data from real life for use in testing and experimenting with the smokechart package.

* **pingtest.txt** and **pingtest2.txt** - these were generated by running `fping 1.1.1.1 -D -c 100000 -i 30000 > pingtest.txt` for a long time.
This command pings a remote host every 30 seconds and records the response time in pingtest#.txt. pingtest2.txt contains a significant
interruption (> 1 hour) and can be used to test the *NaN*
representation.

* **TestMyInternet-samples.txt** and **TestMyInternet-samples2.txt** -
These were generated by the TestMyInter.net program by measuring
XMLHttpRequest() response times to an external server.
The **TestMyInternet-samples2.txt** has a brief interruption with a
Duration of 6000 msec (the timeout).
This could be substited with *NaN*.

## Smokedata files

The top-level directory also contains JSON files with the **smokedata** created from the tools above.
