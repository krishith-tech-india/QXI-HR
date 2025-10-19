using System;
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

    }
}
