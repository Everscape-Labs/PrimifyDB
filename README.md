# PrimifyDB - a primitive time series database


PrimifyDB is a business specific database with performance in mind for particular business related queries :
- Only time series data (if your data has no date, forget this DB)
- IoT in mind : all data is grouped by **device** (via an unique key - or an ipv6 - or what you want)
- So you can easily fetch data for a particular device
- Store what you want, data is Stored as object
- FOR NOW : no search, no sort - the minimum amount of data you can fetch is the number of records for a device for a day.
  


## Features of the early V1

- NO SEARCH - ! FETCHING ONLY !
- Multiple databases at the same time
- Multiple collections for each databases 
- Schemaless
- Object storage
- Fast writes
- Fast reads


## Roadmap

### Features for V2

- [ ] Schema validation for each collection
- [ ] Still Schemaless if you want it
- [ ] Authentication
- [ ] Metrics API 


### features V3

- [ ] Indices
- [ ] Limit
- [ ] Sort
- [ ] Pagination
- [ ] Aggregations 
