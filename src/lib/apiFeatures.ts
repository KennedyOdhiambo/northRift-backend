/* eslint-disable @typescript-eslint/no-explicit-any */
export class APIFeatures {
   private query: any;
   private queryString: any;

   constructor(query: any, queryString: any) {
      this.query = query;
      this.queryString = queryString;
   }

   filter() {
      const queryObj = { ...(this.queryString as any) };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);

      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

      this.query = this.query.find(JSON.parse(queryStr));

      return this;
   }

   sort() {
      if (this.queryString.sort) {
         const sortBy = this.queryString.sort.split(',').join(' ');
         this.query = this.query.sort(sortBy);
      } else {
         this.query = this.query.sort('-createdAt');
      }

      return this;
   }

   limitFields() {
      if (this.queryString.fields) {
         const fields = this.queryString.fields.split(',').join(' ');
         this.query = this.query.select(fields);
      } else {
         this.query = this.query.select('-__v');
      }

      return this;
   }

   paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);

      return this;
   }
}
