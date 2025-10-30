using Data.DbContexts;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Data.Reopsitories
{
    /// <summary>
    /// The repository.
    /// </summary>
    /// <remarks>
    /// Initializes a new instance of the <see cref="Repository"/> class.
    /// </remarks>
    /// <param name="dbContext">The db context.</param>
    public class Repository<TEntity>(QXIDbContext dbContext) : IRepository<TEntity>
        where TEntity : class
    {

        protected DbContext dbContext = dbContext;
        protected DbSet<TEntity> dbSet = dbContext.Set<TEntity>();

        /// <inheritdoc />
        private IQueryable<TEntity> GetQueryable(Expression<Func<TEntity, bool>>? filter = null, bool asNoTracking = true)
        {
            IQueryable<TEntity> query = asNoTracking ? dbSet.AsNoTracking() : dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }
            return query;
        }

        #region GeneralMethods

        /// <inheritdoc />
        public IQueryable<TEntity> GetAll(bool AsNoTracking = true)
        {
            return GetQueryable(null, AsNoTracking);
        }

        /// <inheritdoc />
        public void DeleteById(object id)
        {
            var entity = dbSet.Find(id);
            Delete(entity!);
        }

        /// <inheritdoc />
        public IQueryable<TEntity> Query(Expression<Func<TEntity, bool>> filter, bool asNoTracking = true)
        {
            return GetQueryable(filter, asNoTracking);
        }

        /// <inheritdoc />
        public (int total, IQueryable<TEntity>) PagedQuery(Expression<Func<TEntity, bool>>? filter, int pageNumber, int pageSize, bool asNoTracking = true)
        {
            var query = GetQueryable(filter, asNoTracking);
            var pagedQuery = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            int total = query.Count();
            return (total, pagedQuery);
        }

        /// <inheritdoc />
        public async Task<(int total, IQueryable<TEntity>)> PagedQueryAsync(Expression<Func<TEntity, bool>>? filter, int pageNumber, int pageSize, bool asNoTracking = true)
        {
            var query = GetQueryable(filter, asNoTracking);
            var pagedQuery = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            
            int total = await query.CountAsync();
            return (total, pagedQuery);
        }

        /// <inheritdoc />
        public void Update(TEntity entity)
        {
            if (entity != null)
            {
                dbSet.Update(entity);
            }
        }

        /// <inheritdoc />
        public void UpdateRange(IEnumerable<TEntity> entities)
        {
            if (entities != null && entities.Any())
            {
                dbSet.UpdateRange(entities);
            }
        }

        /// <inheritdoc />
        public void Insert(TEntity entity)
        {
            if (entity != null)
            {
                dbSet.Add(entity);
            }
        }

        /// <inheritdoc />
        public void InsertRange(IEnumerable<TEntity> entities)
        {
            if (entities != null && entities.Any())
            {
                dbSet.AddRange(entities);
            }
        }

        /// <inheritdoc />
        public void Delete(TEntity entity)
        {
            if (dbContext.Entry(entity).State == EntityState.Detached)
            {
                dbSet.Attach(entity);
            }
            dbContext.ChangeTracker.Clear();
            dbSet.Remove(entity);
        }

        /// <inheritdoc />
        public void DeleteRange(IEnumerable<TEntity> entities)
        {
            if (entities != null || entities!.Any())
            {
                dbContext.ChangeTracker.Clear();
                dbSet.RemoveRange(entities!);
            }
        }

        #endregion GeneralMethods

        #region SynchronousMethods

        /// <inheritdoc />
        public virtual TEntity GetById(object Id)
        {
            return dbSet.Find(Id);
        }

        /// <inheritdoc />
        public bool IsExists(Expression<Func<TEntity, bool>> filter)
        {
            IQueryable<TEntity> query = GetQueryable(filter, true);
            return query.Any();
        }

        /// <inheritdoc />
        public int SaveChanges()
        {
            return dbContext.SaveChanges();
        }


        #endregion SynchronousMethods

        #region AsyncMethods

        /// <inheritdoc />
        public async Task<TEntity?> GetByIdAsync(object id)
        {
            return await dbSet.FindAsync(id);
        }

        /// <inheritdoc />
        public async Task<bool> IsExistsAsync(Expression<Func<TEntity, bool>> filter)
        {
            IQueryable<TEntity> query = GetQueryable(filter, true);
            return await query.AnyAsync();
        }

        /// <inheritdoc />
        public async Task<int> SaveChangesAsync()
        {
            return await dbContext.SaveChangesAsync();
        }

        #endregion AsyncMethods

    }
}