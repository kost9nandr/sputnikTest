package cat.book.service;

import cat.book.model.Book;

import javax.ejb.Stateless;
import java.util.HashSet;
import java.util.Set;

@Stateless
public class CatalogService implements ICatalogService {

    private Set<Book> bookList = new HashSet();

    @Override
    public Integer add(String name, String author, boolean isCatalogOpen, long date) {
        Integer id = 0;// a-la hibernate autoincrement
        while (id < 1) {
            id = -id + 1;
            for (Book book : bookList)
                if (book.getId() == id) {
                    id = -id;
                    break;
                }
        }
        Book b = new Book(id, name, author, isCatalogOpen, date);
        bookList.add(b);
        return b.getId();
    }

    @Override
    public void edit(Integer id, String name, String author, boolean isCatalogOpen, long date) {
        Book b = findBookById(id);
        b.setName(name);
        b.setAuthor(author);
        b.setOpen(isCatalogOpen);
        b.setDate(date);
    }

    @Override
    public void remove(Integer id) {
        Book book = findBookById(id);
        bookList.remove(book);
    }


    @Override
    public Set<Book> getAll() {
        return bookList;
    }

    @Override
    public Book findBookById(int id) {
        for (Book book : bookList)
            if (book.getId() == id)
                return book;
        throw new RuntimeException(String.format("Book %d is not found", id));
    }
}
