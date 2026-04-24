using api.Repository;
using api.Transport;
using HotChocolate.Execution;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Snapper;

namespace tests.GraphQL;

[TestFixture]
public class SchemaShould
{
    [Test]
    public async Task HaveNoUnconfirmedChanges()
    {
        var schema = await new ServiceCollection()
            .AddScoped<IUserRepository>(_ => Substitute.For<IUserRepository>())
            .AddScoped<IGroupRepository>(_ => Substitute.For<IGroupRepository>())
            .AddScoped<IGameRepository>(_ => Substitute.For<IGameRepository>())
            .AddGraphQLServer()
            .AddAuthorization()
            .AddTypes()
            .AddGlobalObjectIdentification()
            .AddMutationConventions(applyToAllMutations: true)
            .AddQueryFieldToMutationPayloads()
            .AddErrorFilter<TrophyErrorFilter>()
            .AddSorting()
            .BuildSchemaAsync();
        schema.ToString().ShouldMatchSnapshot();
    }
}