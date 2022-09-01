# `FP`

Finds any `FP` objects thrown as errors, and returns them as "successful" data.

This is most useful when you are using both
a server that returns `FP`-formatted data using non-200 status codes,
and a client library that throws an error for any non-200 status code.
