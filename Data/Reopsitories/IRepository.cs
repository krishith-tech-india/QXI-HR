using System.Linq.Expressions;

namespace Data.Reopsitories
{
    public interface IRepository<TEntity>
        where TEntity : class
    {
        /// <summary>
        /// Deletes the.
        /// </summary>
        /// <param name="entity">The entity.</param>
        void Delete(TEntity entity);

        /// <summary>
        /// Deletes the by id.
        /// </summary>
        /// <param name="id">The id.</param>
        void DeleteById(object id);

        /// <summary>
        /// Deletes the range.
        /// </summary>
        /// <param name="entities">The entities.</param>
        void DeleteRange(IEnumerable<TEntity> entities);

        /// <summary>
        /// Gets the all.
        /// </summary>
        /// <param name="AsNoTracking">If true, as no tracking.</param>
        /// <returns>An IQueryable.</returns>
        IQueryable<TEntity> GetAll(bool AsNoTracking = true);

        /// <summary>
        /// Gets the by id.
        /// </summary>
        /// <param name="Id">The id.</param>
        /// <returns>A TEntity.</returns>
        TEntity GetById(object Id);

        /// <summary>
        /// Gets the by id async.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>A Task.</returns>
        Task<TEntity?> GetByIdAsync(object id);

        /// <summary>
        /// Inserts the.
        /// </summary>
        /// <param name="entity">The entity.</param>
        void Insert(TEntity entity);

        /// <summary>
        /// Inserts the range.
        /// </summary>
        /// <param name="entities">The entities.</param>
        void InsertRange(IEnumerable<TEntity> entities);

        /// <summary>
        /// Are the exists.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <returns>A bool.</returns>
        bool IsExists(Expression<Func<TEntity, bool>> filter);

        /// <summary>
        /// Are the exists async.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <returns>A Task.</returns>
        Task<bool> IsExistsAsync(Expression<Func<TEntity, bool>> filter);

        /// <summary>
        /// Queries the.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <param name="AsNoTracking">If true, as no tracking.</param>
        /// <returns>An IQueryable.</returns>
        IQueryable<TEntity> Query(Expression<Func<TEntity, bool>> filter, bool AsNoTracking = true);

        /// <summary>
        /// Updates the.
        /// </summary>
        /// <param name="entity">The entity.</param>
        void Update(TEntity entity);

        /// <summary>
        /// Updates the range.
        /// </summary>
        /// <param name="entities">The entities.</param>
        void UpdateRange(IEnumerable<TEntity> entities);

        /// <summary>
        /// Saves the changes asynchronously.
        /// </summary>
        /// <returns></returns>
        Task<int> SaveChangesAsync();

        /// <summary>
        /// Save the changes synchronously
        /// </summary>
        /// <returns></returns>
        int SaveChanges();

        /// <summary>
        /// Gets the paged queryable based on given filter page number and pagesize.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <param name="sort">The sort expression.</param>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The no. of records per page.</param>
        /// <param name="isDescending">If true, is descending.</param>
        /// <param name="asNoTracking">If true, as no tracking.</param>
        /// <returns>Returns a <see cref="ValueTuple{int , IQueryable{TEntity}}"/> contains total records and Queryable with the page number and page size.</returns>
        (int total, IQueryable<TEntity>) PagedQuery(Expression<Func<TEntity, bool>>? filter,
                                                    Expression<Func<TEntity, object>>? sort,
                                                    int pageNumber,
                                                    int pageSize,
                                                    bool isDescending = false,
                                                    bool asNoTracking = true);
        /// <summary>
        /// Gets the paged queryable based on given filter page number and pagesize asynchronosly.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <param name="sort">The sort expression.</param>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The no. of records per page.</param>
        /// <param name="isDescending">If true, is descending.</param>
        /// <param name="asNoTracking">If true, as no tracking.</param>
        /// <returns>Returns a <see cref="Task"/> with value value <see cref="ValueTuple{int , IQueryable{TEntity}}"/> contains total records and Queryable with the page number and page size.</returns>
        Task<(int total, IQueryable<TEntity>)> PagedQueryAsync(Expression<Func<TEntity, bool>>? filter,
                                                               Expression<Func<TEntity, object>>? sort,
                                                               int pageNumber,
                                                               int pageSize,
                                                               bool isDescending = false,
                                                               bool asNoTracking = true);


        /// <summary>
        /// Attaches an existing entity to the DbContext without fetching it from the database.
        /// </summary>
        void Attach(TEntity entity);
    }
}
