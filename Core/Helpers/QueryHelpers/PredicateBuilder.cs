using Core.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Core.Helpers
{
    public static class PredicateBuilder 
    {
        public static Expression<Func<T, bool>> True<T>() { return param => true; }

        /// <summary>
        /// Creates a predicate that evaluates to false.
        /// </summary>
        public static Expression<Func<T, bool>> False<T>() { return param => false; }

        /// <summary>
        /// Creates a predicate expression from the specified lambda expression.
        /// </summary>
        public static Expression<Func<T, bool>> Create<T>(Expression<Func<T, bool>> predicate) { return predicate; }

        /// <summary>
        /// Combines the first predicate with the second using the logical "and".
        /// </summary>
        public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
        {
            return first.Compose(second, Expression.AndAlso);
        }

        /// <summary>
        /// Combines the first predicate with the second using the logical "or".
        /// </summary>
        public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
        {
            return first.Compose(second, Expression.OrElse);
        }

        /// <summary>
        /// Negates the predicate.
        /// </summary>
        public static Expression<Func<T, bool>> Not<T>(this Expression<Func<T, bool>> expression)
        {
            var negated = Expression.Not(expression.Body);
            return Expression.Lambda<Func<T, bool>>(negated, expression.Parameters);
        }

        /// <summary>
        /// Combines the first expression with the second using the specified merge function.
        /// </summary>
        private static Expression<T> Compose<T>(this Expression<T> first, Expression<T> second, Func<Expression, Expression, Expression> merge)
        {
            // zip parameters (map from parameters of second to parameters of first)
            var map = first.Parameters
                .Select((f, i) => new { f, s = second.Parameters[i] })
                .ToDictionary(p => p.s, p => p.f);

            // replace parameters in the second lambda expression with the parameters in the first
            var secondBody = ParameterRebinder.ReplaceParameters(map, second.Body);

            // create a merged lambda expression with parameters from the first expression
            return Expression.Lambda<T>(merge(first.Body, secondBody), first.Parameters);
        }

        #region Dynamic Filter-Sort

        public static Expression<Func<T, object>> BuildSortExpression<T>(string fieldName)
        {
            var property = typeof(T).GetProperties().FirstOrDefault(x => x.Name.Equals(fieldName, StringComparison.OrdinalIgnoreCase));

            if (property == null)
                throw new Exception($"No field Found named {fieldName}");

            var param = Expression.Parameter(typeof(T), "x");
            var body = Expression.Property(param, property);

            return Expression.Lambda<Func<T, object>>(body, param);
        }
        public static Expression<Func<T, bool>> BuildFilterExpression<T>(List<CommonFilterParams>? filters)
        {
            if (filters == null || !filters.Any())
                return x => true; // No filters; return a predicate that always evaluates to true.

            ParameterExpression parameter = Expression.Parameter(typeof(T), "x");
            Expression? combinedExpression = null;

            foreach (var filter in filters)
            {
                if (string.IsNullOrEmpty(filter.FieldName) || filter.Value == null)
                    continue;

                var fieldExpression = BuildFieldExpression<T>(parameter, filter);
                if (fieldExpression == null)
                    continue;

                combinedExpression = combinedExpression == null
                    ? fieldExpression
                    : CombineExpressions(combinedExpression, fieldExpression, filter.Condition);
            }

            return Expression.Lambda<Func<T, bool>>(combinedExpression ?? Expression.Constant(true), parameter);
        }

        private static Expression BuildFieldExpression<T>(ParameterExpression param, CommonFilterParams filter)
        {
            var prop = typeof(T).GetProperties().FirstOrDefault(x => x.Name.Equals(filter.FieldName, StringComparison.OrdinalIgnoreCase));

            if (prop is null)
                throw new Exception($"Invalid field name {filter.FieldName}");

            // The member you want to evaluate (x => x.FirstName)
            MemberExpression member = Expression.Property(param, prop);

            // The value you want to evaluate
            var filterOperator = Operators.GetValue(filter.Operator!);

            var filterValue = filter.Value;
            if (prop.PropertyType == typeof(string))
            {
                filterValue = filterValue?.ToString()?.ToLikeFilterString(filterOperator);
            }

            ConstantExpression constant = Expression.Constant(filterValue);

            // Determine how we want to apply the expression
            return filterOperator switch
            {
                Operator.Equals => Expression.Equal(member, constant),
                Operator.NotEquals => Expression.NotEqual(member, constant),
                Operator.Contains => Expression.Call(EF.Functions.GetType().GetMethod("Like")!, member, constant),
                Operator.GreaterThan => Expression.GreaterThan(member, constant),
                Operator.GreaterThanOrEqual => Expression.GreaterThanOrEqual(member, constant),
                Operator.LessThan => Expression.LessThan(member, constant),
                Operator.LessThanOrEqualTo => Expression.LessThanOrEqual(member, constant),
                Operator.StartsWith => Expression.Call(EF.Functions.GetType().GetMethod("Like")!, member, constant),
                Operator.EndsWith => Expression.Call(EF.Functions.GetType().GetMethod("Like")!, member, constant),
                _ => null!,
            };
        }
        private static Expression CombineExpressions(Expression left, Expression right, string? condition)
        {
            return condition?.Equals("or", StringComparison.OrdinalIgnoreCase) ?? false
                ? Expression.OrElse(left, right)
                : Expression.AndAlso(left, right);
        }

        #endregion Dynamic Filter-Sort

        private class ParameterRebinder : ExpressionVisitor
        {
            readonly Dictionary<ParameterExpression, ParameterExpression> map;

            private ParameterRebinder(Dictionary<ParameterExpression, ParameterExpression> map)
            {
                this.map = map ?? new Dictionary<ParameterExpression, ParameterExpression>();
            }

            public static Expression ReplaceParameters(Dictionary<ParameterExpression, ParameterExpression> map, Expression exp)
            {
                return new ParameterRebinder(map).Visit(exp);
            }

            protected override Expression VisitParameter(ParameterExpression p)
            {
                ParameterExpression replacement;

                if (map.TryGetValue(p, out replacement))
                {
                    p = replacement;
                }

                return base.VisitParameter(p);
            }
        }
    }
}
