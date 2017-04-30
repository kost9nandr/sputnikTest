package cat.book.rest;

import cat.book.model.Book;
import cat.book.service.ICatalogService;

import javax.ejb.EJB;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.Set;

@Path("/")
public class CatalogRestService {

    @EJB
    private ICatalogService catalogService;

    @GET
    @Path("catalog/all")
    @Produces("application/json")
    public Response getAll() {
        Set<Book> list = catalogService.getAll();
        return Response.ok(list).build();
    }

    @POST
    @Path("/delete/{id}")
    public Response delBook(@PathParam("id") int id) {
        catalogService.remove(id);
        return Response.noContent().build();

    }

    @POST
    @Path("/edit/{id}/{name}/{author}/{open}/{date}")
    public Response editBook(@PathParam("id") int id, @PathParam("name") String name, @PathParam("author") String author,
                             @PathParam("open") boolean open, @PathParam("date") long date) {
        catalogService.edit(id, name, author, open, date);
        return Response.noContent().build();
    }

    @POST
    @Path("/add/{name}/{author}/{open}/{date}")
    public Response addBook(@PathParam("name") String name, @PathParam("author") String author,
                            @PathParam("open") boolean open, @PathParam("date") long date) {
        Integer bookId = catalogService.add(name, author, open, date);
        return Response.ok(bookId).build();

    }
}
