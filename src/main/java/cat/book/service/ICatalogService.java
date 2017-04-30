package cat.book.service;

import cat.book.model.Book;

import java.util.Set;

public interface ICatalogService {

    /**
     * Все книги, которые есть в каталогах
     */
    Set<Book> getAll();

    /**
     * Получить книгу по номеру
     *
     * @param id номер книги
     */
    Book findBookById(int id);

    /**
     * Добавление новой книги
     *
     * @param name          имя книги
     * @param author        автор книги
     * @param isCatalogOpen каталог(открытый,закрытый)
     * @param date          дата выпуска книги
     * @return
     */
    Integer add(String name, String author, boolean isCatalogOpen, long date);

    /**
     * Редактирование существующей книги
     *
     * @param id            номер книги
     * @param name          название книги
     * @param author        автор книги
     * @param isCatalogOpen каталог(открытый,закрытый)
     * @param date          дата выпуска книги
     */
    void edit(Integer id, String name, String author, boolean isCatalogOpen, long date);

    /**
     * Удалить существующую книгу
     *
     * @param id номер книги
     */
    void remove(Integer id);
}
