mergeMap((event) => {
  let id = event.config.dataProvider.id;
  console.log("request by id", id);
  return from(
    queryFunc(event.query.filters, event.config),
    map((res) => ({ uuid: event.query.id, dataset: res }))
  );
}, limit);

// 并发 mergeMap 竞态 switchMap
