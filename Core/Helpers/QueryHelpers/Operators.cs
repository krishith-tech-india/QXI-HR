namespace Core
{
    public static class Operators
    {
        public static readonly Dictionary<string, Operator> _operators = [];

        static Operators()
        {
            _operators.Add("equals", Operator.Equals);
            _operators.Add("equalto", Operator.Equals);
            _operators.Add("=", Operator.Equals);
            _operators.Add("==", Operator.Equals);
            _operators.Add("===", Operator.Equals);

            _operators.Add("notequals", Operator.NotEquals);
            _operators.Add("notequalto", Operator.NotEquals);
            _operators.Add("!=", Operator.NotEquals);
            _operators.Add("!==", Operator.NotEquals);

            _operators.Add("contains", Operator.Contains);

            _operators.Add("greaterthan", Operator.GreaterThan);
            _operators.Add(">", Operator.GreaterThan);

            _operators.Add("greaterthanorequalto", Operator.GreaterThanOrEqual);
            _operators.Add(">=", Operator.GreaterThanOrEqual);

            _operators.Add("lessthan", Operator.LessThan);
            _operators.Add("<", Operator.LessThan);

            _operators.Add("lessThanorequalto", Operator.LessThanOrEqualTo);
            _operators.Add("<=", Operator.LessThanOrEqualTo);

            _operators.Add("startswith", Operator.StartsWith);
            _operators.Add("endswith", Operator.EndsWith);
        }

        public static Operator GetValue(string operatorVal)
        {
            operatorVal = operatorVal.ToLower().Trim();

            if (_operators.ContainsKey(operatorVal))
                return _operators[operatorVal];
            else
                throw new Exception($"Invalid operator {operatorVal}");
        }
    }

    public enum Operator
    {
        Equals,
        NotEquals,
        Contains,
        GreaterThan,
        GreaterThanOrEqual,
        LessThan,
        LessThanOrEqualTo,
        StartsWith,
        EndsWith,
    }
}
