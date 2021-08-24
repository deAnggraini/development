package id.co.bca.pakar.be.doc.model;

import javax.persistence.*;

//@Entity
//@Table(name = "t_article_content_in_review")
public class ArticleContentInReview extends CommonArticleContent {
    @Id
    @Column(name = "id")
    private Long id = 0L;
    @Version
    @Column(name = "optlock", columnDefinition = "integer DEFAULT 0", nullable = false)
    private Long version;
    @ManyToOne
    @JoinColumn(name = "article_in_review_id")
    private ArticleInReview article;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public ArticleInReview getArticle() {
        return article;
    }

    public void setArticle(ArticleInReview article) {
        this.article = article;
    }
}
